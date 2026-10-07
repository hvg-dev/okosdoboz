function classicScript(src, attributes, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(signal.reason); return; }
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    for (const [name, value] of Object.entries(attributes)) script.setAttribute(name, value);
    const abort = () => { script.remove(); reject(signal.reason); };
    signal.addEventListener('abort', abort, { once: true });
    script.onload = () => { signal.removeEventListener('abort', abort); resolve(); };
    script.onerror = () => { signal.removeEventListener('abort', abort); reject(new Error('Nem tölthető be: ' + src)); };
    document.head.append(script);
  });
}

let startup;
let activeLesson;
export function startLesson(urls, lessonId, signal, onState) {
  if (startup) {
    if (lessonId !== activeLesson) return Promise.reject(new Error('Másik feladathoz teljes oldalbetöltés szükséges.'));
    return startup;
  }
  activeLesson = lessonId;
  startup = (async () => {
    onState('scripts-loading');
    await classicScript(urls.bootstrap, { name: 'carco', project: 'okosdoboz', lib: urls.library }, signal);
    await classicScript(urls.userConfig, {}, signal);
    await classicScript(urls.index, {}, signal);
    if (String(window.carco?.data?.okosdoboz?.id) !== lessonId) throw new Error('A feladat azonosítója nem egyezik.');
    onState('project-loading');
    await new Promise((resolve, reject) => {
      if (signal.aborted) { reject(signal.reason); return; }
      const abort = () => reject(signal.reason);
      signal.addEventListener('abort', abort, { once: true });
      window.carco.functions.loadProjects(() => {
        signal.removeEventListener('abort', abort);
        if (!signal.aborted) resolve();
      });
    });
    if (signal.aborted) throw signal.reason;
    onState('player-created');
    return window.carco.data.okosdoboz.createPlayer();
  })();
  return startup;
}