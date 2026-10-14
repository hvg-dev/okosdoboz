import { createIcons, Maximize, RotateCw } from 'lucide';
import { validateConfig, selectLesson, selectLessonVersion, lessonUrls } from './config.js';
import { startLesson } from './lesson-loader.js';
import { waitForTask } from './readiness.js';
import { observeLayout } from './layout.js';
import { installFullscreen } from './fullscreen.js';
import { installMobileLayout } from './mobile-layout.js';
import { createHybridSvgUrl, getHybridTrack, loadOriginalImage } from '../experiments/1710-track-1/hybrid.js';

createIcons({ icons: { Maximize, RotateCw } });
const svgPocObjectUrls = new Set();
let activeSvgPocObjectUrl;
window.addEventListener('pagehide', () => {
  for (const url of svgPocObjectUrls) URL.revokeObjectURL(url);
}, { once: true });
const status = document.getElementById('status');
const retry = document.getElementById('retry');
const fullscreenButton = document.getElementById('fullscreen');
let viewport = `${window.innerWidth}:${window.innerHeight}`;
function refreshViewport() {
  const next = `${window.innerWidth}:${window.innerHeight}`;
  if (next !== viewport) {
    viewport = next;
    window.dispatchEvent(new Event('resize'));
  }
}
document.addEventListener('visibilitychange', refreshViewport);
const viewportTimer = setInterval(() => { if (document.hidden) refreshViewport(); }, 500);
window.addEventListener('pagehide', () => clearInterval(viewportTimer), { once: true });
retry.addEventListener('click', () => location.reload());
installFullscreen({
  document,
  button: fullscreenButton,
  notice: document.getElementById('fullscreen-notice'),
  onResize: () => window.dispatchEvent(new Event('resize'))
});
const mobileLayout = installMobileLayout({ window, document, button: fullscreenButton });

async function main() {
  const controller = new AbortController();
  let timer;
  let cleanup;
  let taskObserver;
  function fail(error) {
    clearTimeout(timer);
    controller.abort(error);
    cleanup?.();
    taskObserver?.disconnect();
    document.body.dataset.state = 'error';
    document.querySelector('.lesson-container').hidden = true;
    status.hidden = false;
    status.textContent = error.message || 'A feladat nem indítható.';
    retry.hidden = false;
  }
  try {
    timer = setTimeout(() => controller.abort(new Error('A konfiguráció betöltése túl sokáig tart.')), 10000);
    const response = await fetch(new URL('shell-config.json', document.baseURI), { cache: 'no-store', signal: controller.signal });
    if (!response.ok) throw new Error('A keret konfigurációja nem elérhető.');
    const config = validateConfig(await response.json(), location.origin);
    const lessonId = selectLesson(config, location.search);
    const lessonVersion = selectLessonVersion(location.search);
    document.body.dataset.lessonVersion = lessonVersion;
    clearTimeout(timer);
    timer = setTimeout(() => controller.abort(new Error('A feladat betöltése túl sokáig tart.')), config.loadTimeoutMs);
    const onState = state => { document.body.dataset.state = state; };
    const svgPocEnabled = lessonId === '1710' && lessonVersion === 'svg';
    const forcePocTrackOrder = new URLSearchParams(location.hash.slice(1)).has('svg-poc-1710-1');
    const root = await startLesson(lessonUrls(config, lessonId, location.origin), lessonId, controller.signal, onState);
    const compatibility = document.createElement('link');
    compatibility.rel = 'stylesheet';
    compatibility.href = new URL('../src/compatibility.css', import.meta.url);
    document.head.append(compatibility);
    await new Promise((resolve, reject) => {
      const abort = () => reject(controller.signal.reason);
      controller.signal.addEventListener('abort', abort, { once: true });
      compatibility.onload = () => { controller.signal.removeEventListener('abort', abort); resolve(); };
      compatibility.onerror = () => { controller.signal.removeEventListener('abort', abort); reject(new Error('A keret stílusa nem elérhető.')); };
      if (controller.signal.aborted) abort();
    });
    const controls = document.getElementById('controls');
    controls.append(root.carco.playeritems.playerheader, root.carco.playeritems.gametitle_box.parentElement);
    mobileLayout.refresh();
    cleanup = observeLayout(root);
    onState('task-loading');
    await waitForTask(root, lessonId, controller.signal);
    if (svgPocEnabled) await installSvgPoc(root, controller.signal, forcePocTrackOrder);
    clearTimeout(timer);
    onState('ready');
    status.hidden = true;
    document.title = (root.carco.playeritems.gametitle.textContent || 'Feladat') + ' | Okosdoboz';
    let waiting = false;
    taskObserver = new MutationObserver(() => {
      if (waiting || controller.signal.aborted || root.carco.playeritems.preload_layer.style.display === 'none') return;
      waiting = true;
      onState('task-loading');
      timer = setTimeout(() => controller.abort(new Error('A következő pálya betöltése túl sokáig tart.')), config.loadTimeoutMs);
      waitForTask(root, lessonId, controller.signal).then(async () => {
        if (svgPocEnabled) await installSvgPoc(root, controller.signal);
        clearTimeout(timer);
        waiting = false;
        onState('ready');
      }).catch(fail);
    });
    taskObserver.observe(root.carco.playeritems.preload_layer, { attributes: true, attributeFilter: ['style'] });
  } catch (error) {
    fail(error);
  }
}

async function installSvgPoc(root, signal, startAtFirst = false) {
  if (startAtFirst && root.carco.paramsdata.system.currenttrack !== '1710_1') {
    const game = root.carco.paramsdata.games[root.carco.paramsdata.system.currentgame];
    const originalTracks = game.params.originaltracks;
    game.params.tracks = Array.from({ length: originalTracks.length }, (_value, index) => originalTracks[index]);
    root.carco.paramsdata.user.tracksorder = 'order';
    document.body.dataset.state = 'task-loading';
    root.carco.paramsdata.system.currenttrack = '1710_1';
    await new Promise(resolve => root.carco.reloadtrack(() => {
      root.carco.removeAllChildren();
      window.carco.functions.root.callback(root);
      resolve();
    }));
    await waitForTask(root, '1710', signal);
  }
  const trackId = String(root.carco.paramsdata.system.currenttrack);
  const track = getHybridTrack(trackId);
  if (!track) return;
  const item = await waitForTrackImage(root, track.imageName, signal);
  const imageUrl = new URL(root.carco.urls.root + root.carco.urls.imagesfolder + track.imageName, location.origin).href;
  const original = await loadOriginalImage(imageUrl);
  const svgUrl = await createHybridSvgUrl(original, trackId);
  if (activeSvgPocObjectUrl) {
    URL.revokeObjectURL(activeSvgPocObjectUrl);
    svgPocObjectUrls.delete(activeSvgPocObjectUrl);
  }
  activeSvgPocObjectUrl = svgUrl;
  svgPocObjectUrls.add(svgUrl);
  item.style.backgroundImage = `url("${svgUrl}")`;
  item.dataset.svgPoc = trackId;
  item.carco.svgPocObjectUrl = svgUrl;
  if (trackId === '1710_1') {
    const selectbox = Object.values(root.carco.recursivechildren).find(child => child.carco?.customparams?.selectbox);
    if (!selectbox?.children[4]) throw new Error('A válaszválasztó nem található.');
    selectbox.children[4].dataset.svgPocChoiceToggle = trackId;
  }
  document.body.dataset.svgPoc = trackId;
  window.dispatchEvent(new CustomEvent('svg-poc-ready', { detail: { track: trackId, itemId: item.carco.id } }));
}

function waitForTrackImage(root, imageName, signal) {
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(check);
    const abort = () => finish(signal.reason);
    const timeout = setTimeout(() => finish(new Error(`A ${imageName} háttérképelem nem jött létre.`)), 10000);
    function finish(error, item) {
      clearTimeout(timeout);
      observer.disconnect();
      signal.removeEventListener('abort', abort);
      if (error) reject(error);
      else resolve(item);
    }
    function check() {
      const item = Object.values(root.carco.recursivechildren).find(child => child.isConnected && child.carco?.customparams?.image?.newname === imageName);
      if (item) finish(null, item);
    }
    observer.observe(root, { childList: true, subtree: true });
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
    else check();
  });
}
main();