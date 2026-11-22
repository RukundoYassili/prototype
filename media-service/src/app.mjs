import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { openDatabase } from './database.mjs';
import { createUser, hashPassword, token, tokenHash, verifyPassword } from './security.mjs';

const LIMIT = 15 * 1024 * 1024;
const uuid = /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i;
const validText = (s, max) => typeof s === 'string' && s.trim().length > 0 && s.length <= max;
const publicPhoto = row => ({ id: row.id, title: row.title, alt: row.alt, caption: row.caption, position: row.position, src: `/api/media/images/${row.id}/large`, thumbnail: `/api/media/images/${row.id}/thumb`, category: 'School outreach', illustrative: false });

export async function saveImage(root, id, bytes) {
  const image = sharp(bytes, { limitInputPixels: 40_000_000, failOn: 'error', animated: false });
  const metadata = await image.metadata();
  if (!['jpeg', 'png', 'webp'].includes(metadata.format) || !metadata.width || !metadata.height || (metadata.pages || 1) > 1) throw new Error('Unsupported image. Choose a JPEG, PNG or WebP image.');
  const directory = join(root, 'images', id);
  const temporary = `${directory}.tmp`;
  await mkdir(temporary, { recursive: false, mode: 0o700 });
  try {
    await Promise.all([
      image.clone().rotate().resize({ width: 640, height: 640, fit: 'inside', withoutEnlargement: true }).webp({ quality: 78 }).toFile(join(temporary, 'thumb.webp')),
      image.clone().rotate().resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(temporary, 'large.webp')),
    ]);
    await rename(temporary, directory);
  } catch (error) { await rm(temporary, { recursive: true, force: true }); throw error; }
}

export function createApp({ dataDir, origin, secureCookies = true, trustProxy = false }) {
  if (!dataDir || !origin) throw new Error('MEDIA_DATA_DIR and MEDIA_ORIGIN are required.');
  const db = openDatabase(dataDir);
  const app = express();
  app.disable('x-powered-by');
  if (trustProxy) app.set('trust proxy', 1);
  app.use(express.json({ limit: '32kb' }));
  app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.get('origin') !== origin) return res.status(403).json({ error: 'Invalid request origin.' });
    next();
  });
  const attempts = new Map();
  const getSession = req => {
    const cookie = req.headers.cookie?.split(';').map(x => x.trim()).find(x => x.startsWith('vuga_session='))?.slice('vuga_session='.length);
    if (!cookie || !/^[A-Za-z0-9_-]{43}$/.test(cookie)) return null;
    return db.prepare('SELECT u.id,u.username,u.role,s.csrf FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires>? AND u.disabled=0').get(tokenHash(cookie), Date.now());
  };
  const requireUser = (req, res, next) => {
    req.user = getSession(req);
    if (!req.user) return res.status(401).json({ error: 'Please sign in.' });
    if (!['GET','HEAD'].includes(req.method) && req.get('x-csrf-token') !== req.user.csrf) return res.status(403).json({ error: 'Invalid request token.' });
    next();
  };
  const requireAdmin = (req, res, next) => req.user.role === 'admin' ? next() : res.status(403).json({ error: 'Administrator access required.' });
  const noCache = (_req,res,next) => { res.set('Cache-Control','no-store'); next(); };
  app.use('/api/media', noCache);
  app.get('/api/media/health', (_req,res) => res.json({ status: 'ok' }));
  app.post('/api/media/login', (req,res) => {
    const key = req.ip;
    const now = Date.now();
    const prior = (attempts.get(key) || []).filter(time => time > now - 15 * 60_000);
    if (prior.length >= 8) return res.status(429).json({ error: 'Too many attempts. Try again later.' });
    const username = typeof req.body.username === 'string' ? req.body.username : '';
    const user = db.prepare('SELECT * FROM users WHERE username=? AND disabled=0').get(username);
    if (!user || !verifyPassword(req.body.password, user.password_hash)) {
      prior.push(now); attempts.set(key, prior);
      return res.status(401).json({ error: 'Invalid username or password.' });
    }
    attempts.delete(key);
    const session = token(), csrf = token(), expires = now + 8 * 60 * 60_000;
    db.prepare('DELETE FROM sessions WHERE expires<=?').run(now);
    db.prepare('INSERT INTO sessions(token_hash,user_id,csrf,expires) VALUES (?,?,?,?)').run(tokenHash(session),user.id,csrf,expires);
    res.cookie('vuga_session', session, { httpOnly:true, secure:secureCookies, sameSite:'strict', path:'/api/media', maxAge:8*60*60_000 });
    res.json({ user:{ id:user.id, username:user.username, role:user.role }, csrf });
  });
  app.get('/api/media/session', requireUser, (req,res) => res.json({ user:{ id:req.user.id, username:req.user.username, role:req.user.role }, csrf:req.user.csrf }));
  app.post('/api/media/password', requireUser, (req,res) => {
    const row=db.prepare('SELECT password_hash FROM users WHERE id=?').get(req.user.id);
    if (!verifyPassword(req.body.currentPassword,row.password_hash)) return res.status(400).json({error:'Current password is incorrect.'});
    try { const hash=hashPassword(req.body.newPassword); db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(hash,req.user.id); db.prepare('DELETE FROM sessions WHERE user_id=?').run(req.user.id); res.clearCookie('vuga_session',{path:'/api/media',httpOnly:true,secure:secureCookies,sameSite:'strict'}).json({ok:true}); }
    catch { res.status(400).json({error:'New password must contain 12 to 256 characters.'}); }
  });
  app.post('/api/media/logout', requireUser, (req,res) => {
    const cookie=req.headers.cookie.split(';').map(x=>x.trim()).find(x=>x.startsWith('vuga_session=')).slice(13);
    db.prepare('DELETE FROM sessions WHERE token_hash=?').run(tokenHash(cookie));
    res.clearCookie('vuga_session',{path:'/api/media',httpOnly:true,secure:secureCookies,sameSite:'strict'}).json({ok:true});
  });
  app.get('/api/media/galleries/:gallery', (req,res) => {
    if (!db.prepare('SELECT id FROM galleries WHERE id=?').get(req.params.gallery)) return res.status(404).json({ error:'Gallery not found.' });
    const photos=db.prepare('SELECT * FROM photos WHERE gallery_id=? AND published=1 ORDER BY sort_order,id').all(req.params.gallery).map(publicPhoto);
    res.json({photos});
  });
  app.get('/api/media/images/:id/:size', async (req,res) => {
    if (!uuid.test(req.params.id) || !['thumb','large'].includes(req.params.size)) return res.sendStatus(404);
    if (!db.prepare('SELECT id FROM photos WHERE id=? AND published=1').get(req.params.id)) return res.sendStatus(404);
    try { const bytes=await readFile(join(dataDir,'images',req.params.id,`${req.params.size}.webp`)); res.type('webp').send(bytes); } catch { res.sendStatus(404); }
  });
  app.get('/api/media/manage/galleries', requireUser, (_req,res) => res.json({ galleries:db.prepare('SELECT id,title FROM galleries ORDER BY title').all() }));
  app.get('/api/media/manage/galleries/:gallery', requireUser, (req,res) => {
    if (!db.prepare('SELECT id FROM galleries WHERE id=?').get(req.params.gallery)) return res.sendStatus(404);
    res.json({photos:db.prepare('SELECT * FROM photos WHERE gallery_id=? ORDER BY sort_order,id').all(req.params.gallery).map(row=>({...publicPhoto(row),published:!!row.published,sortOrder:row.sort_order}))});
  });
  app.get('/api/media/manage/images/:id/:size', requireUser, async (req,res) => {
    if (!uuid.test(req.params.id) || !['thumb','large'].includes(req.params.size) || !db.prepare('SELECT id FROM photos WHERE id=?').get(req.params.id)) return res.sendStatus(404);
    try { res.type('webp').send(await readFile(join(dataDir,'images',req.params.id,`${req.params.size}.webp`))); } catch { res.sendStatus(404); }
  });
  const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:LIMIT,files:1,fields:8}});
  app.post('/api/media/manage/galleries/:gallery/photos', requireUser, upload.single('image'), async (req,res,next) => {
    if (!db.prepare('SELECT id FROM galleries WHERE id=?').get(req.params.gallery)) return res.sendStatus(404);
    if (!req.file || !validText(req.body.title,160) || !validText(req.body.alt,300)) return res.status(400).json({error:'Image, title and alternative text are required.'});
    const id=randomUUID();
    try {
      await mkdir(join(dataDir,'images'),{recursive:true,mode:0o700});
      await saveImage(dataDir,id,req.file.buffer);
      const order=db.prepare('SELECT COALESCE(MAX(sort_order),0)+1 AS n FROM photos WHERE gallery_id=?').get(req.params.gallery).n;
      db.prepare('INSERT INTO photos(id,gallery_id,title,alt,sort_order) VALUES (?,?,?,?,?)').run(id,req.params.gallery,req.body.title.trim(),req.body.alt.trim(),order);
      res.status(201).json({id});
    } catch (error) { await rm(join(dataDir,'images',id),{recursive:true,force:true}); if (error.code && !['VIPS_ERROR'].includes(error.code)) return next(error); res.status(400).json({error:'The image could not be processed. Use a valid JPEG, PNG or WebP.'}); }
  });
  app.patch('/api/media/manage/photos/:id', requireUser, (req,res) => {
    const row=db.prepare('SELECT * FROM photos WHERE id=?').get(req.params.id);
    if (!row) return res.sendStatus(404);
    const { title,alt,published }=req.body;
    const caption=req.body.caption ?? '';
    if (!validText(title,160) || !validText(alt,300) || typeof caption !== 'string' || caption.length > 500 || typeof published !== 'boolean') return res.status(400).json({error:'Valid title, alternative text, caption and publication status are required.'});
    db.prepare('UPDATE photos SET title=?,alt=?,caption=?,published=? WHERE id=?').run(title.trim(),alt.trim(),caption.trim(),published?1:0,row.id);
    res.json({ok:true});
  });
  app.put('/api/media/manage/galleries/:gallery/order', requireUser, (req,res) => {
    const current=db.prepare('SELECT id FROM photos WHERE gallery_id=?').all(req.params.gallery).map(r=>r.id);
    const ids=req.body.ids;
    if (!Array.isArray(ids) || ids.length!==current.length || new Set(ids).size!==current.length || ids.some(id=>!current.includes(id))) return res.status(400).json({error:'Order must include every photo exactly once.'});
    db.exec('BEGIN IMMEDIATE');
    try { const statement=db.prepare('UPDATE photos SET sort_order=? WHERE id=?'); ids.forEach((id,i)=>statement.run(i,id)); db.exec('COMMIT'); } catch (error) { db.exec('ROLLBACK'); throw error; }
    res.json({ok:true});
  });
  app.get('/api/media/manage/users', requireUser, requireAdmin, (_req,res) => res.json({users:db.prepare('SELECT id,username,role,disabled FROM users ORDER BY username').all()}));
  app.post('/api/media/manage/users', requireUser, requireAdmin, (req,res) => {
    try { const id=createUser(db,req.body.username,req.body.password,req.body.role); res.status(201).json({id}); } catch { res.status(400).json({error:'Check username, password and role, and ensure the username is unique.'}); }
  });
  app.patch('/api/media/manage/users/:id', requireUser, requireAdmin, (req,res) => {
    if (req.params.id===req.user.id || typeof req.body.disabled!=='boolean') return res.status(400).json({error:'You cannot disable your own account.'});
    const result=db.prepare('UPDATE users SET disabled=? WHERE id=?').run(req.body.disabled?1:0,req.params.id);
    if (!result.changes) return res.sendStatus(404);
    if (req.body.disabled) db.prepare('DELETE FROM sessions WHERE user_id=?').run(req.params.id);
    res.json({ok:true});
  });
  app.use((error,_req,res,_next) => { console.error('Media request failed:',error.message); res.status(error instanceof multer.MulterError ? 400 : 500).json({error:error instanceof multer.MulterError ? 'Upload exceeds the 15 MB limit or is invalid.' : 'The request could not be completed.'}); });
  return { app, db };
}
