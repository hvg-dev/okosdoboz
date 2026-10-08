import test from 'node:test';
import assert from 'node:assert/strict';
import { installFullscreen } from '../src/fullscreen.js';

function environment() {
  const classes = new Set();
  const target = { classList: { contains: value => classes.has(value), add: value => classes.add(value), remove: value => classes.delete(value) } };
  const document = Object.assign(new EventTarget(), { documentElement: target });
  const button = Object.assign(new EventTarget(), { dataset: {}, attributes: {}, setAttribute(key, value) { this.attributes[key] = value; } });
  const notice = { hidden: true, textContent: '' };
  installFullscreen({ document, button, notice, onResize() {} });
  return { document, button, notice, target };
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('standard fullscreen a dokumentumra, majd kilépés', async () => {
  const env = environment();
  env.target.requestFullscreen = async function () { assert.equal(this, env.target); env.document.fullscreenElement = this; };
  env.document.exitFullscreen = async () => { env.document.fullscreenElement = null; };
  env.button.dispatchEvent(new Event('click'));
  await settle();
  assert.equal(env.button.dataset.mode, 'native');
  env.button.dispatchEvent(new Event('click'));
  await settle();
  assert.equal(env.button.attributes['aria-pressed'], 'false');
});

test('WebKit fullscreen támogatás', async () => {
  const env = environment();
  env.target.webkitRequestFullscreen = async () => { env.document.webkitFullscreenElement = env.target; };
  env.document.webkitExitFullscreen = async () => { env.document.webkitFullscreenElement = null; };
  env.button.dispatchEvent(new Event('click'));
  await settle();
  assert.equal(env.button.dataset.mode, 'native');
  env.button.dispatchEvent(new Event('click'));
  await settle();
  assert.equal(env.button.dataset.mode, 'normal');
});

test('API-hiba látható fallback, Escape eltávolítja', async () => {
  const env = environment();
  env.target.requestFullscreen = async () => { throw new Error('Not allowed'); };
  env.button.dispatchEvent(new Event('click'));
  await settle();
  assert.equal(env.button.dataset.mode, 'expanded');
  assert.equal(env.notice.hidden, false);
  assert.equal(env.button.title, 'Vissza a vezérlőkhöz');
  env.document.dispatchEvent(Object.assign(new Event('keydown'), { key: 'Escape' }));
  assert.equal(env.button.dataset.mode, 'normal');
});

test('elakadt API-kérés után a gomb újra használható', async () => {
  const env = environment();
  env.target.requestFullscreen = () => new Promise(() => {});
  env.button.dispatchEvent(new Event('click'));
  await new Promise(resolve => setTimeout(resolve, 2700));
  assert.equal(env.button.dataset.mode, 'expanded');
  env.button.dispatchEvent(new Event('click'));
  await settle();
  assert.equal(env.button.dataset.mode, 'normal');
});

test('iPhone jellegű API nélküli gomb nagyítást jelez és visszaállít', async () => {
  const env = environment();
  assert.equal(env.button.title, 'Játék nagyítása');
  env.button.dispatchEvent(new Event('click'));
  await settle();
  assert.equal(env.button.dataset.mode, 'expanded');
  assert.equal(env.target.classList.contains('expanded'), true);
  env.button.dispatchEvent(new Event('click'));
  await settle();
  assert.equal(env.target.classList.contains('expanded'), false);
});

test('letiltott vagy hatástalan fullscreen API is nagyított nézetre vált', async () => {
  const env = environment();
  env.document.fullscreenEnabled = false;
  env.target.requestFullscreen = () => { throw new Error('Must not call disabled API'); };
  env.button.dispatchEvent(new Event('click'));
  await settle();
  assert.equal(env.button.dataset.mode, 'expanded');
  env.button.dispatchEvent(new Event('click'));
  await settle();
  env.document.fullscreenEnabled = true;
  env.target.requestFullscreen = async () => {};
  env.button.dispatchEvent(new Event('click'));
  await settle();
  assert.equal(env.button.dataset.mode, 'expanded');
});

test('kezdőképernyős iPhone indításkor nem kér új natív fullscreent', async () => {
  const env = environment();
  env.document.defaultView = { navigator: { standalone: true } };
  env.target.requestFullscreen = () => { throw new Error('Native request must not run'); };
  env.button.dispatchEvent(new Event('click'));
  await settle();
  assert.equal(env.button.dataset.mode, 'expanded');
  assert.doesNotMatch(env.notice.textContent, /címsora/);
});