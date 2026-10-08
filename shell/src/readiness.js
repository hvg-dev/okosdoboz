export function waitForTask(root, lessonId, signal) {
  return new Promise((resolve, reject) => {
    let frame;
    let stable = 0;
    let previous = '';
    const observer = new MutationObserver(schedule);
    const cleanup = () => { observer.disconnect(); cancelAnimationFrame(frame); clearTimeout(frame); signal.removeEventListener('abort', abort); };
    const abort = () => { cleanup(); reject(signal.reason); };
    function schedule() {
      if (frame !== undefined) return;
      frame = document.hidden ? setTimeout(check, 100) : requestAnimationFrame(check);
    }
    function check() {
      frame = undefined;
      const state = root.carco.paramsdata;
      const preload = root.carco.playeritems.preload_layer;
      const rect = root.getBoundingClientRect();
      const valid = String(state.system.currentgame) === lessonId && state.tracks[state.system.currenttrack] && root.children.length > 0 && rect.width > 0 && rect.height > 0 && preload.style.display === 'none';
      const geometry = `${rect.width}:${rect.height}`;
      stable = valid && geometry === previous ? stable + 1 : 0;
      previous = geometry;
      if (valid && stable >= 2) { cleanup(); resolve(root); }
      else schedule();
    }
    signal.addEventListener('abort', abort, { once: true });
    observer.observe(root.parentElement, { attributes: true, childList: true, subtree: true });
    if (signal.aborted) abort(); else check();
  });
}