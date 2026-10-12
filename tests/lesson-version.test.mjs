import test from 'node:test';
import assert from 'node:assert/strict';
import { selectLesson, selectLessonVersion } from '../src/config.js';

const config = { defaultLessonId: '1710', supportedLessonIds: ['1710'] };

test('explicit original and SVG URLs select the same complete lesson', () => {
  for (const version of ['original', 'svg']) {
    const search = `?lesson=1710&version=${version}`;
    assert.equal(selectLesson(config, search), '1710');
    assert.equal(selectLessonVersion(search), version);
    assert.equal(selectLesson(config, `?version=${version}`), '1710');
  }
});

test('existing URLs keep the SVG default', () => {
  assert.equal(selectLessonVersion(''), 'svg');
  assert.equal(selectLessonVersion('?lesson=1710'), 'svg');
});

test('invalid and repeated versions fail before lesson startup', () => {
  for (const search of ['?version=', '?version=unknown', '?version=SVG', '?version=original&version=svg', '?version=svg&version=svg']) {
    assert.throws(() => selectLesson(config, search), /version/);
  }
  assert.throws(() => selectLesson(config, '?lesson=1710&id=999'));
  assert.throws(() => selectLesson(config, '?lesson=1710&lesson=1710&version=original'));
});