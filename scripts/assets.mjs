import { readFile, cp, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateConfig } from '../src/config.js';

export const shellRoot = fileURLToPath(new URL('../', import.meta.url));
export const sourceRoot = path.resolve(process.env.LESSONS_SOURCE_DIR || path.join(shellRoot, 'lessons'));
export const mathRoot = path.join(shellRoot, 'node_modules/mathjax');

export async function readConfig(origin = 'http://localhost:3000') {
  const input = JSON.parse(await readFile(path.join(shellRoot, 'public/shell-config.json'), 'utf8'));
  if (process.env.LESSONS_PREFIX) input.lessonsPrefix = process.env.LESSONS_PREFIX;
  return validateConfig(input, origin);
}

export async function copyAssets(destination, config) {
  const mount = path.resolve(destination, '.' + config.lessonsPrefix);
  if (!mount.startsWith(path.resolve(destination) + path.sep)) throw new Error('Unsafe output path');
  await mkdir(mount, { recursive: true });
  await cp(path.join(sourceRoot, 'lib'), path.join(mount, 'lib'), { recursive: true });
  for (const id of config.supportedLessonIds) {
    await access(path.join(sourceRoot, id, id, 'index.js'));
    await cp(path.join(sourceRoot, id), path.join(mount, id), { recursive: true });
    await cp(path.join(sourceRoot, 'lib'), path.join(mount, id, 'lib'), { recursive: true });
  }
  for (const library of [path.join(mount, 'lib'), ...config.supportedLessonIds.map(id => path.join(mount, id, 'lib'))]) {
    try {
      await access(path.join(library, 'MathJax-master/MathJax.js'));
    } catch {
      await cp(mathRoot, path.join(library, 'MathJax-master'), { recursive: true, force: false });
    }
  }
}