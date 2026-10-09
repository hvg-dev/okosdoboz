import express from 'express';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { validateConfig } from '../src/config.js';

export async function createProductionApp({ directory, origin = 'http://localhost:8080' }) {
  const root = path.resolve(directory);
  const config = validateConfig(JSON.parse(await readFile(path.join(root, 'shell-config.json'), 'utf8')), origin);
  await access(path.join(root, 'index.html'));
  for (const id of config.supportedLessonIds) await access(path.join(root, '.' + config.lessonsPrefix, id, id, 'index.js'));
  const immutable = new Set((await readdir(root)).filter(name => /\.[a-f0-9]{8,}\.(?:js|css|png|jpg|webp|woff2?)$/.test(name)));
  const app = express();
  app.disable('x-powered-by');
  app.use((_request, response, next) => {
    response.set('X-Content-Type-Options', 'nosniff');
    response.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.set('Cache-Control', 'no-cache');
    next();
  });
  app.use((request, response, next) => {
    if (request.method === 'GET' || request.method === 'HEAD') next();
    else response.set('Allow', 'GET, HEAD').status(405).type('text').send('Method not allowed');
  });
  app.get('/shell-config.json', (_request, response) => response.set('Cache-Control', 'no-store').json(config));
  app.use(express.static(root, {
    dotfiles: 'deny',
    fallthrough: false,
    setHeaders(response, file) {
      if (path.dirname(file) === root && immutable.has(path.basename(file))) {
        response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else response.setHeader('Cache-Control', 'no-cache');
    }
  }));
  app.use((error, _request, response, _next) => {
    const status = error.status >= 400 && error.status < 500 ? error.status : 500;
    if (status === 500) console.error(error);
    response.status(status).type('text').send(status === 404 ? 'Not found' : 'Request failed');
  });
  return app;
}