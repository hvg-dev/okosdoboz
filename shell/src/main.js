import { createIcons, Maximize } from 'lucide';
import { validateConfig, selectLesson, lessonUrls } from './config.js';
import { startLesson } from './lesson-loader.js';
import { waitForTask } from './readiness.js';
import { observeLayout } from './layout.js';

createIcons({ icons: { Maximize } });
const status = document.getElementById('status');
const retry = document.getElementById('retry');
const experience = document.getElementById('experience');
retry.addEventListener('click', () => location.reload());
document.getElementById('fullscreen').addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (experience.requestFullscreen) await experience.requestFullscreen();
    else experience.classList.toggle('expanded');
  } catch { experience.classList.toggle('expanded'); }
  window.dispatchEvent(new Event('resize'));
});
document.addEventListener('fullscreenchange', () => window.dispatchEvent(new Event('resize')));
document.addEventListener('keydown', event => { if (event.key === 'Escape') experience.classList.remove('expanded'); });

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