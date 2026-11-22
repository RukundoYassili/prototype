import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { PGlite } from "@electric-sql/pglite";
import { createApp } from "../src/app.mjs";
import { createUser } from "../src/security.mjs";
import { createEditorialStore } from "../src/editorial-store.mjs";

test("private editorial drafts require an admin and a valid session and CSRF token", async (t) => {
  const dataDir = await mkdtemp(join(tmpdir(), "vuga-editorial-test-"));
  const database = new PGlite();
  await database.exec(
    await readFile(
      new URL("../editorial/001-private-drafts.sql", import.meta.url),
      "utf8",
    ),
  );
  const query = (...args) => database.query(...args);
  const store = createEditorialStore(null, {
    query,
    connect: async () => ({ query, release() {} }),
    end: () => database.close(),
  });
  const { app, db } = createApp({
    dataDir,
    origin: "http://site.test",
    secureCookies: false,
    editorialStore: store,
  });
  createUser(db, "admin", "admin-password-123", "admin");
  const staffId = createUser(db, "staff", "staff-password-123", "staff");
  const reviewerId = createUser(
    db,
    "reviewer",
    "reviewer-password-123",
    "staff",
  );
  const otherId = createUser(db, "other-author", "other-password-123", "staff");
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    db.close();
    await store.close();
    await rm(dataDir, { recursive: true, force: true });
  });
  const url = `http://127.0.0.1:${server.address().port}/api/media`;
  const request = (path, options = {}) => fetch(url + path, options);
  const json = (method, body, auth = {}) => ({
    method,
    headers: {
      Origin: "http://site.test",
      "Content-Type": "application/json",
      ...auth,
    },
    body: JSON.stringify(body),
  });
  const login = async (username, password) => {
    const r = await request("/login", json("POST", { username, password }));
    const cookie = r.headers.get("set-cookie").split(";")[0];
    const data = await r.json();
    return { Cookie: cookie, "X-CSRF-Token": data.csrf };
  };
  assert.equal((await request("/editorial/items")).status, 401);
  const staff = await login("staff", "staff-password-123");
  assert.equal(
    (await request("/editorial/items", { headers: staff })).status,
    403,
  );
  const admin = await login("admin", "admin-password-123");
  assert.equal(
    (await request("/editorial/items", { headers: admin })).status,
    200,
  );
  assert.equal(
    (
      await request(
        `/editorial/users/${staffId}/roles`,
        json("PUT", { roles: ["author"] }, staff),
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await request(
        `/editorial/users/${staffId}/roles`,
        json("PUT", { roles: ["author"] }, admin),
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        `/editorial/users/${reviewerId}/roles`,
        json("PUT", { roles: ["reviewer"] }, admin),
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        `/editorial/users/${otherId}/roles`,
        json("PUT", { roles: ["author"] }, admin),
      )
    ).status,
    200,
  );
  const draft = {
    type: "article",
    title: "A private draft",
    summary: "A short summary",
    language: "English",
    topic: "Wellbeing",
  };
  assert.equal(
    (
      await request(
        "/editorial/items",
        json("POST", draft, { Cookie: admin.Cookie }),
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await request(
        "/editorial/items",
        json("POST", { ...draft, type: "video" }, admin),
      )
    ).status,
    400,
  );
  const created = await request("/editorial/items", json("POST", draft, staff));
  assert.equal(created.status, 201);
  const { id } = await created.json();
  const other = await login("other-author", "other-password-123");
  assert.equal(
    (await (await request("/editorial/items", { headers: other })).json()).items
      .length,
    0,
  );
  assert.equal(
    (
      await request(
        `/editorial/items/${id}`,
        json("PUT", { ...draft, body: "unauthorized", revision: 1 }, other),
      )
    ).status,
    403,
  );
  const list = await (
    await request("/editorial/items", { headers: admin })
  ).json();
  assert.equal(list.items.length, 1);
  assert.equal(list.items[0].status, "draft");
  assert.equal(list.items[0].owner, "staff");
  const review = async (auth, action, revision, note = "") =>
    request(
      `/editorial/items/${id}/review`,
      json("POST", { action, revision, note }, auth),
    );
  assert.equal((await review(staff, "approve", 1)).status, 403);
  assert.equal((await review(staff, "submit", 1)).status, 400);
  const blocks = [
    {
      id: randomUUID(),
      type: "table",
      headers: ["Question", "Answer"],
      rows: [["Why?", "Because."]],
    },
    {
      id: randomUUID(),
      type: "question",
      question: "What helps?",
      answer: "Support.",
    },
  ];
  const update = {
    title: "Updated draft",
    summary: "Updated summary",
    language: "English",
    topic: "Wellbeing",
    body: "Private content",
    revision: 1,
    details: {
      author: "An author",
      nextReview: "2027-01-15",
      externalUrl: "https://example.org/source",
    },
    blocks,
  };
  assert.equal(
    (
      await request(
        `/editorial/items/${id}`,
        json(
          "PUT",
          { ...update, details: { externalUrl: "javascript:alert(1)" } },
          staff,
        ),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await request(
        `/editorial/items/${id}`,
        json(
          "PUT",
          { ...update, details: { nextReview: "2027-02-31" } },
          staff,
        ),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await request(
        `/editorial/items/${id}`,
        json(
          "PUT",
          {
            ...update,
            blocks: [
              {
                id: randomUUID(),
                type: "link",
                label: "bad",
                url: "javascript:alert(1)",
              },
            ],
          },
          staff,
        ),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await request(
        `/editorial/items/${id}`,
        json(
          "PUT",
          { ...update, blocks: [{ id: randomUUID(), type: "toString" }] },
          staff,
        ),
      )
    ).status,
    400,
  );
  assert.equal(
    (await request(`/editorial/items/${id}`, json("PUT", update, staff)))
      .status,
    200,
  );
  assert.equal((await review(staff, "submit", 2)).status, 200);
  assert.equal(
    (
      await request(
        `/editorial/items/${id}/publish`,
        json("POST", { revision: 2, slug: "test", confirmed: true }, staff),
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await request(
        `/editorial/items/${id}/publish`,
        json("POST", { revision: 2, slug: "test", confirmed: true }, admin),
      )
    ).status,
    503,
  );
  const reviewer = await login("reviewer", "reviewer-password-123");
  assert.equal(
    (await review(reviewer, "return", 2, "Check the source.")).status,
    200,
  );
  assert.equal((await review(staff, "submit", 2)).status, 200);
  assert.equal((await review(reviewer, "approve", 2)).status, 200);
  assert.equal(
    (
      await request(
        `/editorial/items/${id}`,
        json("PUT", { ...update, revision: 2 }, staff),
      )
    ).status,
    200,
  );
  assert.equal((await review(reviewer, "approve", 2)).status, 409);
  assert.equal(
    (await request(`/editorial/items/${id}`, json("PUT", update, staff)))
      .status,
    409,
  );
  const updated = (
    await (await request("/editorial/items", { headers: admin })).json()
  ).items[0];
  assert.equal(updated.status, "draft");
  assert.equal(updated.revision, 3);
  assert.equal(updated.details.author, "An author");
  assert.deepEqual(updated.blocks, blocks);
  assert.equal(
    (await database.query("SELECT count(*)::int AS n FROM editorial_revisions"))
      .rows[0].n,
    3,
  );
  assert.equal(
    (await database.query("SELECT count(*)::int AS n FROM editorial_audit"))
      .rows[0].n,
    7,
  );
  assert.equal(
    (await request(`/editorial/items/${id}/activity`, { headers: other }))
      .status,
    404,
  );
  const activity = (
    await (
      await request(`/editorial/items/${id}/activity`, { headers: staff })
    ).json()
  ).activity;
  assert.ok(
    activity.some(
      (event) =>
        event.action === "review.return" &&
        event.metadata.note === "Check the source.",
    ),
  );
  assert.equal(
    (await request(`/editorial/items/${id}/history`, { headers: other }))
      .status,
    404,
  );
  const history = await (
    await request(`/editorial/items/${id}/history`, { headers: staff })
  ).json();
  assert.equal(history.history.length, 3);
  assert.equal(
    (
      await request(
        `/editorial/items/${id}/restore`,
        json("POST", { revision: 2, targetRevision: 1 }, staff),
      )
    ).status,
    409,
  );
  assert.equal(
    (
      await request(
        `/editorial/items/${id}/restore`,
        json("POST", { revision: 3, targetRevision: 1 }, staff),
      )
    ).status,
    200,
  );
  const restored = (
    await (await request("/editorial/items", { headers: staff })).json()
  ).items[0];
  assert.equal(restored.revision, 4);
  assert.equal(restored.title, "A private draft");
  assert.equal(restored.status, "draft");
  const restoreEvent = (
    await database.query(
      "SELECT metadata FROM editorial_audit WHERE action='draft.restored'",
    )
  ).rows[0];
  assert.equal(restoreEvent.metadata.restoredRevision, 1);
  const next = await request(
    "/editorial/items",
    json("POST", { ...draft, title: "Missing image" }, staff),
  );
  const nextId = (await next.json()).id;
  const photoBlock = {
    id: randomUUID(),
    type: "image",
    mediaId: randomUUID(),
    alt: "A photo",
    caption: "",
  };
  assert.equal(
    (
      await request(
        `/editorial/items/${nextId}`,
        json("PUT", { ...update, blocks: [photoBlock], revision: 1 }, staff),
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        `/editorial/items/${nextId}/review`,
        json("POST", { action: "submit", revision: 2 }, staff),
      )
    ).status,
    400,
  );
  const png = await sharp({
    create: { width: 20, height: 20, channels: 3, background: "#557766" },
  })
    .png()
    .toBuffer();
  const upload = new FormData();
  upload.set("title", "A permitted photo");
  upload.set("alt", "An illustration");
  upload.set("image", new Blob([png], { type: "image/png" }), "test.png");
  const uploaded = await request("/manage/galleries/school-outreach/photos", {
    method: "POST",
    headers: { Origin: "http://site.test", ...staff },
    body: upload,
  });
  assert.equal(uploaded.status, 201);
  const photo = (await uploaded.json()).id;
  assert.equal(
    (
      await request(
        `/editorial/items/${nextId}`,
        json(
          "PUT",
          {
            ...update,
            blocks: [{ ...photoBlock, mediaId: photo }],
            revision: 2,
          },
          staff,
        ),
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        `/editorial/items/${nextId}/review`,
        json("POST", { action: "submit", revision: 3 }, staff),
      )
    ).status,
    200,
  );
  assert.equal((await request(`/images/${photo}/thumb`)).status, 404);
  assert.equal((await request("/editorial/items")).status, 401);
  assert.equal(
    (await request("/editorial/public/article/a-private-draft")).status,
    404,
  );
});

test("an unavailable editorial store does not affect the existing media service", async (t) => {
  const dataDir = await mkdtemp(join(tmpdir(), "vuga-editorial-offline-"));
  const { app, db } = createApp({
    dataDir,
    origin: "http://site.test",
    secureCookies: false,
  });
  createUser(db, "admin", "admin-password-123", "admin");
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    db.close();
    await rm(dataDir, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${server.address().port}/api/media`;
  const response = await fetch(`${base}/login`, {
    method: "POST",
    headers: { Origin: "http://site.test", "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "admin-password-123" }),
  });
  const cookie = response.headers.get("set-cookie").split(";")[0];
  assert.equal(
    (await fetch(`${base}/editorial/items`, { headers: { Cookie: cookie } }))
      .status,
    503,
  );
  assert.equal((await fetch(`${base}/health`)).status, 200);
});

test("staging import preserves structured source material, remains private and is repeatable", async (t) => {
  const database = new PGlite();
  await database.exec(
    await readFile(
      new URL("../editorial/001-private-drafts.sql", import.meta.url),
      "utf8",
    ),
  );
  const query = (...args) => database.query(...args);
  const store = createEditorialStore(null, {
    query,
    connect: async () => ({ query, release() {} }),
    end: () => database.close(),
  });
  t.after(() => store.close());
  const original = {
    sections: [
      {
        id: "one",
        blocks: [
          { type: "table", headers: ["A", "B"], rows: [["1", "2"]] },
          {
            type: "questions",
            items: [{ question: "Why?", answer: "Because." }],
          },
        ],
      },
    ],
    references: [{ number: 1, text: "A source" }],
    safetyNotices: [{ type: "paragraph", text: "Clinical review required." }],
    pdfUrl: "/learning/chapter.pdf",
    publicationStatus: "review required",
  };
  const source = {
    sourceKey: "chapter:test:one",
    route: "/learning/one",
    type: "chapter",
    title: "One",
    summary: "A chapter",
    language: "English",
    topic: "Learning",
    record: original,
  };
  assert.equal(await store.importSource([source]), 1);
  assert.equal(await store.importSource([source]), 0);
  const row = (
    await database.query("SELECT * FROM editorial_drafts WHERE source_key=$1", [
      source.sourceKey,
    ])
  ).rows[0];
  assert.deepEqual(row.source_record, original);
  assert.equal(row.status, "draft");
  assert.equal(row.source_route, source.route);
  assert.equal(
    await store.update(
      { id: "admin", role: "admin", username: "admin" },
      row.id,
      1,
      {
        title: "changed",
        summary: "changed",
        language: "English",
        topic: "Learning",
        body: "text",
      },
    ),
    "import_locked",
  );
  assert.equal(
    await store.transition(
      { id: "admin", role: "admin", username: "admin" },
      row.id,
      1,
      "submit",
      "",
    ),
    "import_locked",
  );
});

test("experimental publication exposes only an approved snapshot and preserves it during later edits", async (t) => {
  const dataDir = await mkdtemp(join(tmpdir(), "vuga-publish-test-"));
  const database = new PGlite();
  await database.exec(
    await readFile(
      new URL("../editorial/001-private-drafts.sql", import.meta.url),
      "utf8",
    ),
  );
  const query = (...args) => database.query(...args);
  const store = createEditorialStore(null, {
    query,
    connect: async () => ({ query, release() {} }),
    end: () => database.close(),
  });
  const { app, db } = createApp({
    dataDir,
    origin: "http://site.test",
    secureCookies: false,
    editorialStore: store,
    publicationEnabledForTests: true,
  });
  createUser(db, "admin", "admin-password-123", "admin");
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    db.close();
    await store.close();
    await rm(dataDir, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${server.address().port}/api/media`;
  const request = (path, options = {}) => fetch(base + path, options);
  const json = (method, body, auth = {}) => ({
    method,
    headers: {
      Origin: "http://site.test",
      "Content-Type": "application/json",
      ...auth,
    },
    body: JSON.stringify(body),
  });
  const login = await request(
    "/login",
    json("POST", { username: "admin", password: "admin-password-123" }),
  );
  const cookie = login.headers.get("set-cookie").split(";")[0],
    csrf = (await login.json()).csrf,
    auth = { Cookie: cookie, "X-CSRF-Token": csrf };
  const path = "/editorial/public/article/a-safe-page";
  assert.equal((await request(path)).status, 404);
  const created = await request(
    "/editorial/items",
    json(
      "POST",
      {
        type: "article",
        title: "Original title",
        summary: "Original summary",
        language: "English",
        topic: "Wellbeing",
      },
      auth,
    ),
  );
  const { id } = await created.json();
  const save = {
    title: "Original title",
    summary: "Original summary",
    language: "English",
    topic: "Wellbeing",
    body: "Original body",
    revision: 1,
    details: { contentOwner: "Private owner", author: "Public author" },
    blocks: [],
  };
  assert.equal(
    (await request(`/editorial/items/${id}`, json("PUT", save, auth))).status,
    200,
  );
  const review = (action) =>
    request(
      `/editorial/items/${id}/review`,
      json("POST", { action, revision: 2 }, auth),
    );
  assert.equal(
    (
      await request(
        `/editorial/items/${id}/publish`,
        json(
          "POST",
          { revision: 2, slug: "a-safe-page", confirmed: true },
          auth,
        ),
      )
    ).status,
    409,
  );
  assert.equal((await review("submit")).status, 200);
  assert.equal((await review("approve")).status, 200);
  assert.equal(
    (
      await request(
        `/editorial/items/${id}/publish`,
        json(
          "POST",
          { revision: 2, slug: "a-safe-page", confirmed: true },
          auth,
        ),
      )
    ).status,
    200,
  );
  let publicItem = (await (await request(path)).json()).item;
  assert.equal(publicItem.body, "Original body");
  assert.equal(publicItem.details.author, "Public author");
  assert.equal(publicItem.details.contentOwner, undefined);
  assert.equal(publicItem.owner, undefined);
  assert.equal(
    (
      await request(
        `/editorial/items/${id}`,
        json(
          "PUT",
          {
            ...save,
            title: "Unpublished title",
            body: "Unpublished body",
            language: "French",
            revision: 2,
          },
          auth,
        ),
      )
    ).status,
    409,
  );
  assert.equal(
    (
      await request(
        `/editorial/items/${id}`,
        json(
          "PUT",
          {
            ...save,
            title: "Unpublished title",
            body: "Unpublished body",
            revision: 2,
          },
          auth,
        ),
      )
    ).status,
    200,
  );
  publicItem = (await (await request(path)).json()).item;
  assert.equal(publicItem.title, "Original title");
  assert.equal(publicItem.body, "Original body");
  assert.equal((await request(`${path}?language=French`)).status, 404);
  assert.equal(
    (
      await request(
        `/editorial/items/${id}/publish`,
        json(
          "POST",
          { revision: 3, slug: "a-safe-page", confirmed: true },
          auth,
        ),
      )
    ).status,
    409,
  );
  assert.equal(
    (
      await request(
        `/editorial/items/${id}/archive`,
        json("POST", { revision: 3, confirmed: true }, auth),
      )
    ).status,
    200,
  );
  assert.equal((await request(path)).status, 404);
  assert.equal(
    (
      await request(
        `/editorial/items/${id}`,
        json("PUT", { ...save, revision: 3 }, auth),
      )
    ).status,
    409,
  );
  assert.equal(
    (
      await request(
        `/editorial/items/${id}/restore`,
        json("POST", { revision: 3, targetRevision: 2 }, auth),
      )
    ).status,
    200,
  );
  assert.equal((await request(path)).status, 404);
  const translation = {
    title: "Une traduction",
    summary: "Résumé",
    language: "French",
  };
  const translated = await request(
    `/editorial/items/${id}/translations`,
    json("POST", translation, auth),
  );
  assert.equal(translated.status, 201);
  assert.equal(
    (
      await request(
        `/editorial/items/${id}/translations`,
        json("POST", { ...translation, language: "french" }, auth),
      )
    ).status,
    409,
  );
  const versions = (
    await (await request("/editorial/items", { headers: auth })).json()
  ).items;
  assert.equal(versions.length, 2);
  assert.equal(versions[0].groupId, versions[1].groupId);
  assert.equal(
    versions.find((item) => item.language === "French").status,
    "draft",
  );
  assert.equal((await request(`${path}?language=French`)).status, 404);
  const png = await sharp({
    create: { width: 20, height: 20, channels: 3, background: "#557766" },
  })
    .png()
    .toBuffer();
  const upload = new FormData();
  upload.set("title", "Test image");
  upload.set("alt", "A test photo");
  upload.set("image", new Blob([png], { type: "image/png" }), "test.png");
  const photoResponse = await request(
    "/manage/galleries/school-outreach/photos",
    {
      method: "POST",
      headers: { Origin: "http://site.test", ...auth },
      body: upload,
    },
  );
  assert.equal(photoResponse.status, 201);
  const photo = (await photoResponse.json()).id;
  const imageDraft = await request(
    "/editorial/items",
    json(
      "POST",
      {
        type: "article",
        title: "Photo story",
        summary: "A photo story",
        language: "English",
        topic: "Community",
      },
      auth,
    ),
  );
  const photoItem = (await imageDraft.json()).id;
  const imageBlock = {
    id: randomUUID(),
    type: "image",
    mediaId: photo,
    alt: "A test photo",
    caption: "",
  };
  assert.equal(
    (
      await request(
        `/editorial/items/${photoItem}`,
        json(
          "PUT",
          {
            title: "Photo story",
            summary: "A photo story",
            language: "English",
            topic: "Community",
            body: "A photo story.",
            revision: 1,
            blocks: [imageBlock],
          },
          auth,
        ),
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        `/editorial/items/${photoItem}/review`,
        json("POST", { action: "submit", revision: 2 }, auth),
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        `/editorial/items/${photoItem}/review`,
        json("POST", { action: "approve", revision: 2 }, auth),
      )
    ).status,
    200,
  );
  const publishPhoto = () =>
    request(
      `/editorial/items/${photoItem}/publish`,
      json("POST", { revision: 2, slug: "photo-story", confirmed: true }, auth),
    );
  assert.equal((await publishPhoto()).status, 400);
  assert.equal(
    (
      await request(
        `/manage/photos/${photo}`,
        json(
          "PATCH",
          {
            title: "Test image",
            alt: "A test photo",
            caption: "",
            published: true,
          },
          auth,
        ),
      )
    ).status,
    200,
  );
  assert.equal((await publishPhoto()).status, 200);
  assert.equal(
    (await request("/editorial/public/article/photo-story")).status,
    200,
  );
});
