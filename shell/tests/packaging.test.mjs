import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { sourceRoot, shellRoot, readConfig } from '../scripts/assets.mjs';

async function verifyDirectory(source, output) {
  for (const item of await readdir(source, { withFileTypes: true })) {
    const src = path.join(source, item.name);
    const dst = path.join(output, item.name);
    if (item.isDirectory()) await verifyDirectory(src, dst);
    else {
      const hash = buffer => createHash('sha256').update(buffer).digest('hex');
      assert.equal(hash(await readFile(src)), hash(await readFile(dst)), src);
    }
  }
}

test('legacy fájlok és generált könyvtáralias bájtazonosak', async () => {
  const config = await readConfig();
  const mount = path.join(shellRoot, 'dist', config.lessonsPrefix);
  await verifyDirectory(path.join(sourceRoot, 'lib'), path.join(mount, 'lib'));
  for (const id of config.supportedLessonIds) {
    await verifyDirectory(path.join(sourceRoot, id), path.join(mount, id));
    await verifyDirectory(path.join(sourceRoot, 'lib'), path.join(mount, id, 'lib'));
  }
});