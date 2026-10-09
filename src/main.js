import { createIcons, Maximize, RotateCw } from 'lucide';
import { validateConfig, selectLesson, lessonUrls } from './config.js';
import { startLesson } from './lesson-loader.js';
import { waitForTask } from './readiness.js';
import { observeLayout } from './layout.js';
import { installFullscreen } from './fullscreen.js';

createIcons({ icons: { Maximize, RotateCw } });
const status = document.getElementById('status');
const retry = document.getElementById('retry');
const experience = document.getElementById('experience');
const fullscreenButton = document.getElementById('fullscreen');
const rotatePrompt = document.getElementById('rotate-prompt');
const phonePortrait = window.matchMedia('(orientation: portrait) and (max-width: 600px)');
function updateOrientation() {
  rotatePrompt.hidden = !phonePortrait.matches;
  experience.inert = phonePortrait.matches;
}
phonePortrait.addEventListener('change', updateOrientation);
window.addEventListener('resize', updateOrientation);
let viewport = `${window.innerWidth}:${window.innerHeight}`;
function refreshViewport() {
  const next = `${window.innerWidth}:${window.innerHeight}`;
  if (next !== viewport) {
    viewport = next;
    updateOrientation();
    window.dispatchEvent(new Event('resize'));
  }
}
document.addEventListener('visibilitychange', refreshViewport);
const viewportTimer = setInterval(() => { if (document.hidden) refreshViewport(); }, 500);
window.addEventListener('pagehide', () => clearInterval(viewportTimer), { once: true });
updateOrientation();
retry.addEventListener('click', () => location.reload());
installFullscreen({
  document,
  button: fullscreenButton,
  notice: document.getElementById('fullscreen-notice'),
  onResize: () => window.dispatchEvent(new Event('resize'))
});

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
    clearTimeout(timer);
    timer = setTimeout(() => controller.abort(new Error('A feladat betöltése túl sokáig tart.')), config.loadTimeoutMs);
    const onState = state => { document.body.dataset.state = state; };
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
    cleanup = observeLayout(root);
    onState('task-loading');
    await waitForTask(root, lessonId, controller.signal);
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
      waitForTask(root, lessonId, controller.signal).then(() => {
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
main();