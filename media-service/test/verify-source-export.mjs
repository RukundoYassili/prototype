// Read-only verification of a prepared export in a disposable PGlite database.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { createEditorialStore } from '../src/editorial-store.mjs';
if (!process.argv[2]) throw new Error('Provide a source export path.');
const source=JSON.parse(await readFile(process.argv[2],'utf8'));
const db=new PGlite();
try {
  await db.exec(await readFile(new URL('../editorial/001-private-drafts.sql',import.meta.url),'utf8'));
  const query=(...args)=>db.query(...args);
  const store=createEditorialStore(null,{query,connect:async()=>({query,release(){}}),end:()=>db.close()});
  assert.equal(await store.importSource(source.items),source.items.length);
  assert.equal(await store.importSource(source.items),0);
  const rows=(await db.query('SELECT source_key,source_route,source_record,status FROM editorial_drafts')).rows;
  assert.equal(rows.length,source.items.length);
  const byKey=new Map(source.items.map(item=>[item.sourceKey,item]));
  for (const row of rows) { const original=byKey.get(row.source_key);assert.ok(original);assert.equal(row.source_route,original.route);assert.equal(row.status,'draft');assert.deepEqual(row.source_record,original.record); }
  console.log(`Verified ${rows.length} source records, preserved structure and repeat import; all remain private drafts.`);
} finally { await db.close(); }
