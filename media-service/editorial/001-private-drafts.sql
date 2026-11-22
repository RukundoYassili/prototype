-- Apply only to the isolated editorial database, never the media SQLite database.
BEGIN;
CREATE TABLE IF NOT EXISTS editorial_drafts (
  id uuid PRIMARY KEY,
  group_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('article','chapter','resource','community','support')),
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 160),
  summary text NOT NULL CHECK (length(summary) BETWEEN 1 AND 1000),
  language text NOT NULL CHECK (length(language) BETWEEN 1 AND 40),
  topic text NOT NULL CHECK (length(topic) BETWEEN 1 AND 80),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','published','archived')),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  body text NOT NULL DEFAULT '',
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  review_note text NOT NULL DEFAULT '',
  source_key text UNIQUE,
  source_route text,
  source_record jsonb,
  public_slug text,
  published_language text,
  published_revision integer,
  owner_id text NOT NULL,
  owner text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(type,published_language,public_slug)
);
CREATE UNIQUE INDEX IF NOT EXISTS editorial_group_language ON editorial_drafts(group_id,lower(language));
CREATE TABLE IF NOT EXISTS editorial_revisions (
  item_id uuid NOT NULL REFERENCES editorial_drafts(id),
  revision integer NOT NULL,
  snapshot jsonb NOT NULL,
  actor_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (item_id, revision)
);
CREATE TABLE IF NOT EXISTS editorial_audit (
  id uuid PRIMARY KEY,
  actor_id text NOT NULL,
  actor_name text NOT NULL,
  action text NOT NULL,
  item_id uuid NOT NULL REFERENCES editorial_drafts(id),
  revision integer NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMIT;
