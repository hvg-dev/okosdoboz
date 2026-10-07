import test from 'node:test';
import assert from 'node:assert/strict';

const urls = { bootstrap: '/lessons/lib/okosdoboz.js', userConfig: '/lessons/lib/odconfig_user.js', index: '/lessons/1710/1710/index.js', library: '/lessons/1710/lib/' };

function environment(projectReady) {
  const scripts = [];
  let projects = 0;
  let players = 0;
  globalThis.window = { carco: { data: { okosdoboz: { id: '1710', createPlayer: () => { players++; return 'root'; } } }, functions: { loadProjects: callback => { projects++; projectReady(callback); } } } };
  globalThis.document = {
    createElement: () => ({ attributes: {}, setAttribute(name, value) { this.attributes[name] = value; }, remove() {} }),
    head: { append(script) { scripts.push(script); queueMicrotask(() => script.onload()); } }
  };
  return { scripts, counts: () => [projects, players] };
}

test('klasszikus scriptek sorrendje, egyszeri player és eltérő ID védelme', async () => {
  const env = environment(callback => callback());
  const { startLesson } = await import('../src/lesson-loader.js?single');
  const controller = new AbortController();
  const first = startLesson(urls, '1710', controller.signal, () => {});
  assert.equal(startLesson(urls, '1710', controller.signal, () => {}), first);
  assert.equal(await first, 'root');
  assert.deepEqual(env.counts(), [1, 1]);
  assert.deepEqual(env.scripts.map(item => item.src), [urls.bootstrap, urls.userConfig, urls.index]);
  assert.equal(env.scripts[0].attributes.lib, urls.library);
  await assert.rejects(startLesson(urls, '999', controller.signal, () => {}));
});

test('abort után késői projektcallback nem indít playert', async () => {
  let callback;
  let registered;
  const started = new Promise(resolve => { registered = resolve; });
  const env = environment(value => { callback = value; registered(); });
  const { startLesson } = await import('../src/lesson-loader.js?abort');
  const controller = new AbortController();
  const pending = startLesson(urls, '1710', controller.signal, () => {});
  await started;
  controller.abort(new Error('timeout'));
  await assert.rejects(pending, /timeout/);
  callback();
  assert.deepEqual(env.counts(), [1, 0]);
});