import { readFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { openDatabase } from './database.mjs';
import { saveImage } from './app.mjs';

const root = process.env.MEDIA_DATA_DIR;
const website = process.env.WEBSITE_PUBLIC_DIR;
if (!root || !website) throw new Error('Set MEDIA_DATA_DIR and WEBSITE_PUBLIC_DIR.');
const db = openDatabase(root);
const items = [
  ['conversation','school-conversation.webp','A student speaks into a microphone during a school gathering','A student shares during a school gathering','50% 50%'],
  ['learning','school-learning.webp','A speaker addresses a group seated around classroom tables','Learning together','50% 50%'],
  ['assembly','school-assembly.webp','A speaker addresses students gathered in a school hall','A conversation in a school hall','50% 58%'],
  ['team','school-team.webp','Four people stand together outdoors at a school','Together at a school','50% 38%'],
  ['listening','school-listening.webp','Students listen while a speaker addresses a school assembly','Listening together','50% 66%'],
  ['partnership','school-partnership.webp','Four people stand outside a school administration building','Connecting with a school community','50% 25%'],
  ['speakers','school-speakers.webp','Speakers stand at the front of a school hall','Sharing in a school hall','50% 50%'],
  ['together','school-together.webp','Two people stand together in a school hall among students','A moment together','50% 50%'],
].map(([id,file,alt,title,position])=>({ id:`school-${id}`, path:join(website,'images','community','outreach',file), gallery:'school-outreach',alt,title,position }));
const first=[11,1,3,26,24,19];
for (const n of [...first,...Array.from({length:37},(_,i)=>i+1).filter(n=>!first.includes(n))]) items.push({
  id:`cyanika-${n}`, path:join(website,'community-outreach','cyanika',`photo-${String(n).padStart(2,'0')}.jpg`), gallery:'cyanika-technical-secondary-school-outreach',
  alt:n===24||n===30?'A sign for Cyanika Technical Secondary School':n===2?'A projected presentation during the school outreach':`A moment from the outreach at Cyanika Technical Secondary School, photo ${n}`,
  title:`Cyanika outreach photo ${n}`,position:'50% 50%',
});
await mkdir(join(root,'images'),{recursive:true,mode:0o700});
for (const [index,item] of items.entries()) {
  const hash=createHash('sha256').update(item.id).digest('hex');
  const id=`${hash.slice(0,8)}-${hash.slice(8,12)}-4${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20,32)}`;
  if (db.prepare('SELECT id FROM photos WHERE id=?').get(id)) continue;
  await rm(join(root,'images',id),{recursive:true,force:true});
  await saveImage(root,id,await readFile(item.path));
  db.prepare('INSERT INTO photos(id,gallery_id,title,alt,position,sort_order,published) VALUES (?,?,?,?,?,?,1)').run(id,item.gallery,item.title,item.alt,item.position,index);
}
console.log(`Imported or verified ${items.length} outreach photographs.`);
db.close();
