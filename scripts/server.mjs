import express from 'express';
import httpProxy from 'http-proxy';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { shellRoot, sourceRoot, mathRoot, readConfig } from './assets.mjs';
import { validateConfig, normalizePrefix } from '../src/config.js';

const preview = process.argv.includes('--preview');
const port = Number(process.env.PORT || 3000);
const origin = `http://localhost:${port}`;
const config = preview
  ? validateConfig(JSON.parse(await readFile(path.join(shellRoot, 'dist/shell-config.json'), 'utf8')), origin)
  : await readConfig(origin);
if (preview && process.env.LESSONS_PREFIX && normalizePrefix(process.env.LESSONS_PREFIX, origin) !== config.lessonsPrefix) {
  throw new Error('A preview prefixe csak új builddel változtatható.');
}
const app = express();
const server = createServer(app);
let parcel;
let proxy;

app.get('/shell-config.json', (_request, response) => response.set('Cache-Control', 'no-store').json(config));
if (preview) {
  app.use(config.lessonsPrefix.slice(0, -1), express.static(path.join(shellRoot, 'dist', config.lessonsPrefix), { fallthrough: false }));
  app.use(express.static(path.join(shellRoot, 'dist')));
} else {
  const staticOptions = { fallthrough: true, dotfiles: 'deny' };
  const prefix = config.lessonsPrefix.slice(0, -1);
  const serveLibrary = mount => {
    app.use(mount, express.static(path.join(sourceRoot, 'lib'), staticOptions));
    app.use(mount + '/MathJax-master', express.static(mathRoot, { fallthrough: false }));
  };
  serveLibrary(prefix + '/lib');
  for (const id of config.supportedLessonIds) serveLibrary(prefix + '/' + id + '/lib');
  app.use(prefix, express.static(sourceRoot, staticOptions));
  app.use(prefix, (_request, response) => response.status(404).type('text').send('Asset not found'));
  app.use('/compatibility.css', express.static(path.join(shellRoot, 'src/compatibility.css')));
  const internalPort = Number(process.env.PARCEL_PORT || port + 1);
  proxy = httpProxy.createProxyServer({ target: `http://127.0.0.1:${internalPort}`, ws: true });
  proxy.on('error', (_error, _request, response) => {
    if (response?.writeHead) response.writeHead(503, { 'Content-Type': 'text/plain' }).end('Parcel is starting');
  });
  app.use((request, response) => proxy.web(request, response));
  server.on('upgrade', (request, socket, head) => proxy.ws(request, socket, head));
  parcel = spawn(process.execPath, [path.join(shellRoot, 'node_modules/parcel/lib/bin.js'), 'serve', 'index.html', '--dist-dir', '.parcel-dev', '--host', '127.0.0.1', '--port', String(internalPort)], { cwd: shellRoot, stdio: 'inherit', env: { ...process.env, PARCEL_WORKERS: '2' } });
  parcel.on('exit', code => { if (code) process.exit(code); });
}

app.use((error, _request, response, _next) => response.status(error.status || 500).type('text').send('Request failed'));
server.on('error', error => { console.error(error.message); parcel?.kill(); process.exit(1); });
server.listen(port, '0.0.0.0', () => console.log(`Shell: http://localhost:${port}/?lesson=${config.defaultLessonId}`));
function close() {
  parcel?.kill();
  proxy?.close();
  server.close(() => process.exit(0));
}
process.on('SIGINT', close);
process.on('SIGTERM', close);