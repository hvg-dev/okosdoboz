import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { createProductionApp } from './production-app.mjs';

const port = Number(process.env.PORT || 8080);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
const directory = process.env.DIST_DIR || fileURLToPath(new URL('../dist/', import.meta.url));
const app = await createProductionApp({ directory, origin: process.env.SHELL_ORIGIN || `http://localhost:${port}` });
const server = createServer(app);
server.requestTimeout = 30000;
server.headersTimeout = 10000;
server.keepAliveTimeout = 5000;
server.on('error', error => { console.error(error.message); process.exit(1); });
server.listen(port, '0.0.0.0', () => console.log(`Production server listening on ${port}`));
let closing = false;
function shutdown() {
  if (closing) return;
  closing = true;
  const deadline = setTimeout(() => { server.closeAllConnections(); process.exit(1); }, 10000);
  deadline.unref();
  server.close(() => { clearTimeout(deadline); process.exit(0); });
  server.closeIdleConnections();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);