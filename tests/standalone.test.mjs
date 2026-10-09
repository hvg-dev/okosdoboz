import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const output = new URL('../dist/', import.meta.url);

test('standalone manifest, iPhone meta és PNG ikonok a buildben', async () => {
  const html = await readFile(new URL('index.html', output), 'utf8');
  assert.match(html, /apple-mobile-web-app-capable/);
  assert.match(html, /viewport-fit=cover/);
  assert.match(html, /apple-touch-icon/);
  const manifest = JSON.parse(await readFile(new URL('app.webmanifest', output), 'utf8'));
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.scope, './');
  for (const icon of manifest.icons) {
    const buffer = await readFile(new URL(icon.src, output));
    assert.equal(buffer.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    const size = Number(icon.sizes.split('x')[0]);
    assert.equal(buffer.readUInt32BE(16), size);
    assert.equal(buffer.readUInt32BE(20), size);
  }
  const appleTag = html.match(/<link\b[^>]*\brel=(?:"apple-touch-icon"|'apple-touch-icon'|apple-touch-icon)(?:\s|>)[^>]*>/)?.[0];
  const applePath = appleTag?.match(/\bhref=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/)?.slice(1).find(Boolean);
  assert.ok(applePath);
  const apple = await readFile(new URL(applePath, output));
  assert.equal(apple.readUInt32BE(16), 180);
});