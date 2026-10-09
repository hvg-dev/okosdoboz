import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { normalizePrefix, validateConfig, selectLesson, lessonUrls } from '../src/config.js';

const origin = 'http://localhost:3000';
const raw = JSON.parse(await readFile(new URL('../public/shell-config.json', import.meta.url)));
const config = validateConfig(raw, origin);

test('prefix normalizálás és új feladatstruktúra', () => {
  assert.equal(normalizePrefix('/content/lessons/', origin), '/content/lessons/');
  assert.equal(selectLesson(config, '?lesson=1710'), '1710');
  assert.equal(selectLesson(config, ''), '1710');
  const urls = lessonUrls(config, '1710', origin);
  assert.equal(urls.index, origin + '/lessons/1710/1710/index.js');
  assert.equal(urls.library, '/lessons/1710/lib/');
  assert.equal(new URL('../tracksjs/1710_game.js', new URL(urls.library, origin)).href, origin + '/lessons/1710/tracksjs/1710_game.js');
});

test('HTTPS library útvonal nem kerül a legacy protokollnormalizálóba', () => {
  const httpsOrigin = 'https://okosdoboz-poc.staging-hvg.hu';
  const urls = lessonUrls(validateConfig(raw, httpsOrigin), '1710', httpsOrigin);
  assert.equal(urls.library, '/lessons/1710/lib/');
  assert.equal(new URL(urls.library + 'default_images/good.png', httpsOrigin).href, httpsOrigin + '/lessons/1710/lib/default_images/good.png');
});

test('tiltott prefixek és motorparaméterek', () => {
  for (const prefix of ['/', '//other/lib', 'https://other.test/lessons', '/lessons/../lib', '/%2e%2e/lib', '/lessons?x=1', '/lessons\\lib']) {
    assert.throws(() => normalizePrefix(prefix, origin));
  }
  for (const query of ['?lesson=', '?lesson=1710&lesson=1710', '?id=1710', '?lesson=1710&playersize=fullscreen', '?lesson=999']) {
    assert.throws(() => selectLesson(config, query));
  }
});