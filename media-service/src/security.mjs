import { randomBytes, scryptSync, timingSafeEqual, createHash, randomUUID } from 'node:crypto';

export const token = () => randomBytes(32).toString('base64url');
export const tokenHash = value => createHash('sha256').update(value).digest('hex');
export function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 256) throw new Error('Passwords must contain 12 to 256 characters.');
  const salt = randomBytes(16).toString('hex');
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}
export function verifyPassword(password, stored) {
  try {
    const [type, salt, hash] = stored.split(':');
    if (type !== 'scrypt' || !salt || !hash || typeof password !== 'string' || password.length > 256) return false;
    const expected = Buffer.from(hash, 'hex');
    const actual = scryptSync(password, salt, expected.length);
    return expected.length === 64 && timingSafeEqual(expected, actual);
  } catch { return false; }
}
export function createUser(db, username, password, role) {
  if (typeof username !== 'string' || !/^[a-zA-Z0-9._-]{3,40}$/.test(username) || !['admin','staff'].includes(role)) throw new Error('Invalid username or role.');
  const id = randomUUID();
  db.prepare('INSERT INTO users(id,username,password_hash,role) VALUES (?,?,?,?)').run(id, username, hashPassword(password), role);
  return id;
}
