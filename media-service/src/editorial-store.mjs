import pg from "pg";
import { randomUUID } from "node:crypto";
import { blocksComplete } from "./editorial-blocks.mjs";

// This staging foundation keeps work private. It deliberately exposes no
// publication endpoint until public delivery and recovery are ready.
export function createEditorialStore(connectionString, poolOverride = null) {
  if (!connectionString && !poolOverride) return null;
  const pool =
    poolOverride ||
    new pg.Pool({ connectionString, max: 4, connectionTimeoutMillis: 5000 });
  return {
    async list(actor, canSeeAll) {
      const result = await pool.query(
        `SELECT id, group_id AS "groupId", type, title, summary, language, topic, status, revision, body, details, blocks,
        review_note AS "reviewNote", owner_id AS "ownerId", owner, source_key IS NOT NULL AS imported, published_revision IS NOT NULL AS "hasPublished", public_slug AS "publicSlug", updated_at AS "updatedAt"
        FROM editorial_drafts WHERE ($1::boolean OR owner_id=$2) ORDER BY updated_at DESC LIMIT 501`,
        [canSeeAll, actor.id],
      );
      return result.rows;
    },
    async importSource(items) {
      const client = await pool.connect();
      let imported = 0;
      try {
        await client.query("BEGIN");
        for (const item of items) {
          const id = randomUUID();
          const result = await client.query(
            `INSERT INTO editorial_drafts(id,group_id,type,title,summary,language,topic,owner_id,owner,source_key,source_route,source_record)
            VALUES ($1,$1,$2,$3,$4,$5,$6,'legacy-import','Source import',$7,$8,$9)
            ON CONFLICT (source_key) DO NOTHING RETURNING *`,
            [
              id,
              item.type,
              item.title,
              item.summary,
              item.language,
              item.topic,
              item.sourceKey,
              item.route,
              JSON.stringify(item.record),
            ],
          );
          if (!result.rows.length) continue;
          const row = result.rows[0];
          await client.query(
            "INSERT INTO editorial_revisions(item_id,revision,snapshot,actor_id) VALUES ($1,1,$2,$3)",
            [id, JSON.stringify(row), "legacy-import"],
          );
          await client.query(
            "INSERT INTO editorial_audit(id,actor_id,actor_name,action,item_id,revision) VALUES ($1,'legacy-import','Source import','source.imported',$2,1)",
            [randomUUID(), id],
          );
          imported++;
        }
        await client.query("COMMIT");
        return imported;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async history(actor, id, canSeeAll) {
      const parent = (
        await pool.query("SELECT owner_id FROM editorial_drafts WHERE id=$1", [
          id,
        ])
      ).rows[0];
      if (!parent || (!canSeeAll && parent.owner_id !== actor.id)) return null;
      const result = await pool.query(
        `SELECT revision, actor_id AS "actorId", created_at AS "createdAt",
        snapshot->>'title' AS title, snapshot->>'summary' AS summary
        FROM editorial_revisions WHERE item_id=$1 ORDER BY revision DESC LIMIT 100`,
        [id],
      );
      return result.rows;
    },
    async activity(actor, id, canSeeAll) {
      const parent = (
        await pool.query("SELECT owner_id FROM editorial_drafts WHERE id=$1", [
          id,
        ])
      ).rows[0];
      if (!parent || (!canSeeAll && parent.owner_id !== actor.id)) return null;
      const result = await pool.query(
        `SELECT action, actor_name AS "actorName", revision, metadata,
        created_at AS "createdAt" FROM editorial_audit WHERE item_id=$1 ORDER BY created_at DESC,id DESC LIMIT 100`,
        [id],
      );
      return result.rows;
    },
    async publish(
      actor,
      id,
      expectedRevision,
      slug,
      validateReferences = () => true,
    ) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const row = (
          await client.query(
            "SELECT * FROM editorial_drafts WHERE id=$1 FOR UPDATE",
            [id],
          )
        ).rows[0];
        if (!row) {
          await client.query("ROLLBACK");
          return "not_found";
        }
        if (row.source_key) {
          await client.query("ROLLBACK");
          return "import_locked";
        }
        if (row.revision !== expectedRevision) {
          await client.query("ROLLBACK");
          return "conflict";
        }
        if (row.status !== "approved") {
          await client.query("ROLLBACK");
          return "invalid_state";
        }
        if (
          (row.public_slug && row.public_slug !== slug) ||
          (row.published_language && row.published_language !== row.language)
        ) {
          await client.query("ROLLBACK");
          return "unstable_route";
        }
        if (
          !row.body.trim() ||
          !blocksComplete(row.blocks) ||
          !validateReferences(row.blocks)
        ) {
          await client.query("ROLLBACK");
          return "invalid_content";
        }
        await client.query(
          "UPDATE editorial_drafts SET status='published',public_slug=$2,published_language=language,published_revision=revision,updated_at=CURRENT_TIMESTAMP WHERE id=$1",
          [id, slug],
        );
        await client.query(
          "INSERT INTO editorial_audit(id,actor_id,actor_name,action,item_id,revision,metadata) VALUES ($1,$2,$3,'content.published',$4,$5,$6)",
          [
            randomUUID(),
            actor.id,
            actor.username,
            id,
            row.revision,
            JSON.stringify({ slug }),
          ],
        );
        await client.query("COMMIT");
        return "ok";
      } catch (error) {
        await client.query("ROLLBACK");
        if (error.code === "23505") return "duplicate_slug";
        throw error;
      } finally {
        client.release();
      }
    },
    async published(type, slug, language) {
      const result = await pool.query(
        `SELECT d.type,d.public_slug,d.published_language,r.snapshot
        FROM editorial_drafts d JOIN editorial_revisions r ON r.item_id=d.id AND r.revision=d.published_revision
        WHERE d.type=$1 AND d.public_slug=$2 AND d.published_language=$3 AND d.published_revision IS NOT NULL`,
        [type, slug, language],
      );
      const row = result.rows[0];
      if (!row) return null;
      const source = row.snapshot,
        details = source.details || {};
      const publicKeys = [
        "author",
        "sourcesText",
        "seoTitle",
        "seoDescription",
        "provider",
        "contact",
        "location",
        "availability",
        "verificationDate",
        "eventDate",
        "endDate",
        "timeZone",
        "format",
        "externalUrl",
        "chapterNumber",
        "seriesTitle",
        "downloadUrl",
      ];
      return {
        type: row.type,
        slug: row.public_slug,
        language: row.published_language,
        title: source.title,
        summary: source.summary,
        body: source.body,
        blocks: source.blocks,
        details: Object.fromEntries(
          publicKeys
            .filter((key) => typeof details[key] === "string")
            .map((key) => [key, details[key]]),
        ),
      };
    },
    async archive(actor, id, expectedRevision) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const row = (
          await client.query(
            "SELECT * FROM editorial_drafts WHERE id=$1 FOR UPDATE",
            [id],
          )
        ).rows[0];
        if (!row) {
          await client.query("ROLLBACK");
          return "not_found";
        }
        if (row.source_key) {
          await client.query("ROLLBACK");
          return "import_locked";
        }
        if (row.revision !== expectedRevision) {
          await client.query("ROLLBACK");
          return "conflict";
        }
        if (row.status === "archived") {
          await client.query("ROLLBACK");
          return "invalid_state";
        }
        await client.query(
          "UPDATE editorial_drafts SET status='archived',published_revision=NULL,updated_at=CURRENT_TIMESTAMP WHERE id=$1",
          [id],
        );
        await client.query(
          "INSERT INTO editorial_audit(id,actor_id,actor_name,action,item_id,revision,metadata) VALUES ($1,$2,$3,'content.archived',$4,$5,$6)",
          [
            randomUUID(),
            actor.id,
            actor.username,
            id,
            row.revision,
            JSON.stringify({
              previousPublishedRevision: row.published_revision,
            }),
          ],
        );
        await client.query("COMMIT");
        return "ok";
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async restore(actor, id, expectedRevision, targetRevision) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const prior = (
          await client.query(
            "SELECT * FROM editorial_drafts WHERE id=$1 FOR UPDATE",
            [id],
          )
        ).rows[0];
        if (!prior) {
          await client.query("ROLLBACK");
          return "not_found";
        }
        if (actor.role !== "admin" && prior.owner_id !== actor.id) {
          await client.query("ROLLBACK");
          return "forbidden";
        }
        if (prior.source_key) {
          await client.query("ROLLBACK");
          return "import_locked";
        }
        if (prior.revision !== expectedRevision) {
          await client.query("ROLLBACK");
          return "conflict";
        }
        const snapshot = (
          await client.query(
            "SELECT snapshot FROM editorial_revisions WHERE item_id=$1 AND revision=$2",
            [id, targetRevision],
          )
        ).rows[0]?.snapshot;
        if (!snapshot) {
          await client.query("ROLLBACK");
          return "not_found";
        }
        const result = await client.query(
          `UPDATE editorial_drafts SET title=$2,summary=$3,language=$4,topic=$5,body=$6,details=$7,blocks=$8,
          status='draft',review_note='',revision=revision+1,updated_at=CURRENT_TIMESTAMP WHERE id=$1 RETURNING *`,
          [
            id,
            snapshot.title,
            snapshot.summary,
            snapshot.language,
            snapshot.topic,
            snapshot.body,
            JSON.stringify(snapshot.details),
            JSON.stringify(snapshot.blocks),
          ],
        );
        const row = result.rows[0];
        await client.query(
          "INSERT INTO editorial_revisions(item_id,revision,snapshot,actor_id) VALUES ($1,$2,$3,$4)",
          [id, row.revision, JSON.stringify(row), actor.id],
        );
        await client.query(
          "INSERT INTO editorial_audit(id,actor_id,actor_name,action,item_id,revision,metadata) VALUES ($1,$2,$3,'draft.restored',$4,$5,$6)",
          [
            randomUUID(),
            actor.id,
            actor.username,
            id,
            row.revision,
            JSON.stringify({ restoredRevision: targetRevision }),
          ],
        );
        await client.query("COMMIT");
        return "ok";
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async create(actor, input) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const id = randomUUID();
        const result = await client.query(
          `INSERT INTO editorial_drafts
          (id, group_id, type, title, summary, language, topic, owner_id, owner)
          VALUES ($1,$1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
          [
            id,
            input.type,
            input.title,
            input.summary,
            input.language,
            input.topic,
            actor.id,
            actor.username,
          ],
        );
        await client.query(
          "INSERT INTO editorial_revisions(item_id,revision,snapshot,actor_id) VALUES ($1,1,$2,$3)",
          [id, JSON.stringify(result.rows[0]), actor.id],
        );
        await client.query(
          `INSERT INTO editorial_audit (id, actor_id, actor_name, action, item_id, revision)
          VALUES ($1,$2,$3,'draft.created',$4,1)`,
          [randomUUID(), actor.id, actor.username, id],
        );
        await client.query("COMMIT");
        return id;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async createTranslation(actor, sourceId, input) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const source = (
          await client.query(
            "SELECT * FROM editorial_drafts WHERE id=$1 FOR UPDATE",
            [sourceId],
          )
        ).rows[0];
        if (!source) {
          await client.query("ROLLBACK");
          return { error: "not_found" };
        }
        if (actor.role !== "admin" && source.owner_id !== actor.id) {
          await client.query("ROLLBACK");
          return { error: "forbidden" };
        }
        if (source.source_key) {
          await client.query("ROLLBACK");
          return { error: "import_locked" };
        }
        const id = randomUUID();
        const row = (
          await client.query(
            `INSERT INTO editorial_drafts(id,group_id,type,title,summary,language,topic,owner_id,owner)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [
              id,
              source.group_id,
              source.type,
              input.title,
              input.summary,
              input.language,
              source.topic,
              actor.id,
              actor.username,
            ],
          )
        ).rows[0];
        await client.query(
          "INSERT INTO editorial_revisions(item_id,revision,snapshot,actor_id) VALUES ($1,1,$2,$3)",
          [id, JSON.stringify(row), actor.id],
        );
        await client.query(
          "INSERT INTO editorial_audit(id,actor_id,actor_name,action,item_id,revision,metadata) VALUES ($1,$2,$3,'translation.created',$4,1,$5)",
          [
            randomUUID(),
            actor.id,
            actor.username,
            id,
            JSON.stringify({ sourceId }),
          ],
        );
        await client.query("COMMIT");
        return { id };
      } catch (error) {
        await client.query("ROLLBACK");
        if (error.code === "23505") return { error: "duplicate_language" };
        throw error;
      } finally {
        client.release();
      }
    },
    async update(actor, id, expectedRevision, input) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const prior = (
          await client.query(
            "SELECT * FROM editorial_drafts WHERE id=$1 FOR UPDATE",
            [id],
          )
        ).rows[0];
        if (!prior) {
          await client.query("ROLLBACK");
          return "not_found";
        }
        if (actor.role !== "admin" && prior.owner_id !== actor.id) {
          await client.query("ROLLBACK");
          return "forbidden";
        }
        if (prior.source_key) {
          await client.query("ROLLBACK");
          return "import_locked";
        }
        if (prior.revision !== expectedRevision) {
          await client.query("ROLLBACK");
          return "conflict";
        }
        if (prior.status === "archived") {
          await client.query("ROLLBACK");
          return "invalid_state";
        }
        if (
          prior.published_language &&
          prior.published_language.toLowerCase() !==
            input.language.toLowerCase()
        ) {
          await client.query("ROLLBACK");
          return "immutable_language";
        }
        const result = await client.query(
          `UPDATE editorial_drafts SET title=$2, summary=$3, language=$4, topic=$5, body=$6, details=$7, blocks=$8,
          status='draft', review_note='', revision=revision+1, updated_at=CURRENT_TIMESTAMP WHERE id=$1 RETURNING *`,
          [
            id,
            input.title,
            input.summary,
            input.language,
            input.topic,
            input.body,
            JSON.stringify(input.details ?? prior.details),
            JSON.stringify(input.blocks ?? prior.blocks),
          ],
        );
        const row = result.rows[0];
        await client.query(
          "INSERT INTO editorial_revisions(item_id,revision,snapshot,actor_id) VALUES ($1,$2,$3,$4)",
          [id, row.revision, JSON.stringify(row), actor.id],
        );
        await client.query(
          "INSERT INTO editorial_audit(id,actor_id,actor_name,action,item_id,revision) VALUES ($1,$2,$3,'draft.updated',$4,$5)",
          [randomUUID(), actor.id, actor.username, id, row.revision],
        );
        await client.query("COMMIT");
        return "ok";
      } catch (error) {
        await client.query("ROLLBACK");
        if (error.code === "23505") return "duplicate_language";
        throw error;
      } finally {
        client.release();
      }
    },
    async transition(
      actor,
      id,
      expectedRevision,
      action,
      note,
      validateReferences = () => true,
    ) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const row = (
          await client.query(
            "SELECT * FROM editorial_drafts WHERE id=$1 FOR UPDATE",
            [id],
          )
        ).rows[0];
        if (!row) {
          await client.query("ROLLBACK");
          return "not_found";
        }
        if (row.revision !== expectedRevision) {
          await client.query("ROLLBACK");
          return "conflict";
        }
        if (
          action === "submit" &&
          actor.role !== "admin" &&
          row.owner_id !== actor.id
        ) {
          await client.query("ROLLBACK");
          return "forbidden";
        }
        if (row.source_key) {
          await client.query("ROLLBACK");
          return "import_locked";
        }
        if (
          action === "submit" &&
          (!row.body.trim() ||
            !blocksComplete(row.blocks) ||
            !validateReferences(row.blocks))
        ) {
          await client.query("ROLLBACK");
          return "invalid_content";
        }
        const next =
          action === "submit" && row.status === "draft"
            ? "in_review"
            : action === "approve" && row.status === "in_review"
              ? "approved"
              : action === "return" && row.status === "in_review"
                ? "draft"
                : null;
        if (!next) {
          await client.query("ROLLBACK");
          return "invalid_state";
        }
        await client.query(
          "UPDATE editorial_drafts SET status=$2,review_note=$3,updated_at=CURRENT_TIMESTAMP WHERE id=$1",
          [id, next, note],
        );
        await client.query(
          "INSERT INTO editorial_audit(id,actor_id,actor_name,action,item_id,revision,metadata) VALUES ($1,$2,$3,$4,$5,$6,$7)",
          [
            randomUUID(),
            actor.id,
            actor.username,
            `review.${action}`,
            id,
            row.revision,
            JSON.stringify({ note }),
          ],
        );
        await client.query("COMMIT");
        return "ok";
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async close() {
      await pool.end();
    },
  };
}
