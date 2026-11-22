// Run only against a disposable staging PostgreSQL database with the schema
// already installed. No records imported here become public or editable.
import pg from 'pg';
import { readFile } from 'node:fs/promises';
import { createEditorialStore } from '../src/editorial-store.mjs';

if (process.env.EDITORIAL_IMPORT_ISOLATED !== '1' || process.env.NODE_ENV === 'production' || !process.env.EDITORIAL_DATABASE_URL || !process.argv[2]) throw new Error('An isolated staging database and export file are required.');
const pool=new pg.Pool({connectionString:process.env.EDITORIAL_DATABASE_URL,max:1,connectionTimeoutMillis:5000});
try {
  const db=(await pool.query('SELECT current_database() AS name')).rows[0].name;
  if (!/(?:^|[_-])(staging|test)(?:$|[_-])/i.test(db)) throw new Error('Database name must identify a staging or test database.');
  const source=JSON.parse(await readFile(process.argv[2],'utf8'));
  if (source.format!==1 || !Array.isArray(source.items) || source.items.length>10000) throw new Error('Invalid source export.');
  const seen=new Set();
  for (const item of source.items) {
    if (!item || typeof item.sourceKey!=='string' || !item.sourceKey || item.sourceKey.length>250 || seen.has(item.sourceKey) || !['article','chapter','resource','community','support'].includes(item.type) || (item.route !== null && (typeof item.route!=='string' || !/^\/(?!\/)/.test(item.route))) || !item.record || typeof item.record!=='object' || Array.isArray(item.record)) throw new Error('Invalid or duplicate source record.');
    for (const [key,max] of [['title',160],['summary',1000],['language',40],['topic',80]]) if (typeof item[key]!=='string' || !item[key].trim() || item[key].length>max) throw new Error(`Invalid source ${key}.`);
    seen.add(item.sourceKey);
  }
  const store=createEditorialStore(null,pool);
  const count=await store.importSource(source.items);
  console.log(`Imported ${count} private source records; ${source.items.length-count} already existed.`);
} finally { await pool.end(); }
