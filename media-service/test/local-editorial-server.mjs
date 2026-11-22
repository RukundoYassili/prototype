// Disposable local QA server. Never point this script at production data.
import { PGlite } from '@electric-sql/pglite';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../src/app.mjs';
import { createUser } from '../src/security.mjs';
import { createEditorialStore } from '../src/editorial-store.mjs';

const dataDir=await mkdtemp(join(tmpdir(),'vuga-studio-local-'));
const database=new PGlite();
await database.exec(await readFile(new URL('../editorial/001-private-drafts.sql',import.meta.url),'utf8'));
const query=(...args)=>database.query(...args);
const store=createEditorialStore(null,{query,connect:async()=>({query,release(){}}),end:()=>database.close()});
const {app,db}=createApp({dataDir,origin:'http://127.0.0.1:5179',secureCookies:false,editorialStore:store});
createUser(db,'testadmin','temporary-testing-password','admin');
createUser(db,'teststaff','temporary-testing-password','staff');
const server=app.listen(13019,'127.0.0.1',()=>console.log('Disposable editorial QA server listening on 127.0.0.1:13019'));
let closed=false;
async function close(){ if(closed)return;closed=true;server.closeAllConnections();await new Promise(resolve=>server.close(resolve));db.close();await store.close();await rm(dataDir,{recursive:true,force:true});process.exit(0); }
process.on('SIGINT',close);process.on('SIGTERM',close);
