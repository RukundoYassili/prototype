import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

export function openDatabase(root) {
  mkdirSync(root, { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(join(root, 'media.sqlite'));
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL COLLATE NOCASE, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','staff')), disabled INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, csrf TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS editorial_roles (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, role TEXT NOT NULL CHECK(role IN ('author','reviewer','publisher')), PRIMARY KEY(user_id,role));
    CREATE TABLE IF NOT EXISTS editorial_role_audit (id TEXT PRIMARY KEY, actor_id TEXT NOT NULL REFERENCES users(id), target_id TEXT NOT NULL REFERENCES users(id), roles TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS galleries (id TEXT PRIMARY KEY, title TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS photos (id TEXT PRIMARY KEY, gallery_id TEXT NOT NULL REFERENCES galleries(id), title TEXT NOT NULL, alt TEXT NOT NULL, position TEXT NOT NULL DEFAULT '50% 50%', sort_order INTEGER NOT NULL, published INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE INDEX IF NOT EXISTS photos_gallery_order ON photos(gallery_id, sort_order);
  `);
  if (!db.prepare('PRAGMA table_info(photos)').all().some(column => column.name === 'caption')) db.exec("ALTER TABLE photos ADD COLUMN caption TEXT NOT NULL DEFAULT ''");
  db.prepare('INSERT OR IGNORE INTO galleries (id,title) VALUES (?,?)').run('cyanika-technical-secondary-school-outreach', 'Cyanika Technical Secondary School');
  db.prepare('INSERT OR IGNORE INTO galleries (id,title) VALUES (?,?)').run('school-outreach', 'School outreach');
  return db;
}
