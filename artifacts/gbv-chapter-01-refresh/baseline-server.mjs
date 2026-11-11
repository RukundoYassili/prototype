import { createServer } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = 'artifacts/gbv-chapter-01-refresh';
const records = JSON.parse(await readFile(`${root}/before/source-files.json`, 'utf8'));
const originals = new Map(await Promise.all(records.map(async record => [path.resolve(record.path).replaceAll('\\', '/').toLowerCase(), await readFile(`${root}/before/${record.path.replaceAll('/', '__')}`, 'utf8')])));
const server = await createServer({
  root: process.cwd(),
  cacheDir: 'artifacts/gbv-chapter-01-refresh/baseline-vite-cache',
  configFile: false,
  server: { host: '127.0.0.1', port: 5191, strictPort: true },
  plugins: [{ name: 'read-only-original-chapter-snapshot', enforce: 'pre', load(id) { return originals.get(id.split('?')[0].replaceAll('\\', '/').toLowerCase()); } }],
});
await server.listen();
await writeFile(`${root}/baseline-server.pid`, String(process.pid));
console.log('Read-only baseline snapshot available at http://127.0.0.1:5191');
setTimeout(async () => { await server.close(); process.exit(0); }, 600000);
