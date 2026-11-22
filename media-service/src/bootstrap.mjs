import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { openDatabase } from './database.mjs';
import { createUser } from './security.mjs';

const db = openDatabase(process.env.MEDIA_DATA_DIR || './data');
if (db.prepare('SELECT COUNT(*) AS count FROM users WHERE role = ?').get('admin').count) throw new Error('An administrator already exists.');
if (!stdin.isTTY) throw new Error('Bootstrap requires an interactive terminal.');
const rl = createInterface({ input: stdin, output: stdout });
const username = await rl.question('Administrator username: ');
rl.close();
async function secret(prompt) {
  stdout.write(prompt);
  stdin.setRawMode(true); stdin.resume();
  return new Promise((resolve, reject) => {
    let value = '';
    const onData = chunk => {
      for (const char of chunk.toString('utf8')) {
        if (char === '\u0003') { cleanup(); reject(new Error('Cancelled.')); return; }
        if (char === '\r' || char === '\n') { cleanup(); stdout.write('\n'); resolve(value); return; }
        if (char === '\u007f' || char === '\b') value = value.slice(0,-1);
        else if (char >= ' ') value += char;
      }
    };
    function cleanup() { stdin.off('data',onData); stdin.setRawMode(false); stdin.pause(); }
    stdin.on('data',onData);
  });
}
const password = await secret('Administrator password: ');
const confirmation = await secret('Confirm password: ');
if (password !== confirmation) throw new Error('Passwords do not match.');
createUser(db, username, password, 'admin');
console.log('Administrator created.');
db.close();
