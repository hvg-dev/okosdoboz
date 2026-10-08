export function installFullscreen({ document, button, notice, onResize }) {
  const target = document.documentElement;
  let pending = false;
  const nativeElement = () => document.fullscreenElement || document.webkitFullscreenElement;
  const standalone = () => Boolean(document.defaultView?.navigator?.standalone) || Boolean(document.defaultView?.matchMedia?.('(display-mode: standalone)').matches);
  const requestMethod = () => {
    if (standalone()) return null;
    if (document.fullscreenEnabled !== false && target.requestFullscreen) return target.requestFullscreen;
    if (document.webkitFullscreenEnabled !== false && target.webkitRequestFullscreen) return target.webkitRequestFullscreen;
    return null;
  };
  function update() {
    const native = Boolean(nativeElement());
    const expanded = target.classList.contains('expanded');
    button.setAttribute('aria-pressed', String(native || expanded));
    button.title = native ? 'Kilépés a teljes képernyőből' : expanded ? 'Vissza a vezérlőkhöz' : requestMethod() ? 'Teljes képernyő' : 'Játék nagyítása';
    button.setAttribute('aria-label', button.title);
    button.dataset.mode = native ? 'native' : expanded ? 'expanded' : 'normal';
    onResize();
  }
  function fallback() {
    target.classList.add('expanded');
    notice.textContent = standalone()
      ? 'Nagyított játéknézet. A jobb felső gombbal visszatérhetsz a vezérlőkhöz.'
      : 'Nagyított játéknézet. A böngésző címsora megmaradhat. A jobb felső gombbal visszatérhetsz a vezérlőkhöz.';
    notice.hidden = false;
  }
  async function bounded(operation) {
    let timer;
    try {
      await Promise.race([
        operation(),
        new Promise((_resolve, reject) => { timer = setTimeout(() => reject(new Error('Fullscreen timeout')), 2500); })
      ]);
    } finally { clearTimeout(timer); }
  }
  async function toggle() {
    if (pending) return;
    pending = true;
    notice.hidden = true;
    try {
      if (nativeElement()) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (!exit) throw new Error('Fullscreen exit unsupported');
        await bounded(() => exit.call(document));
      } else if (target.classList.contains('expanded')) {
        target.classList.remove('expanded');
      } else {
        const request = requestMethod();
        if (request) {
          await bounded(() => request.call(target));
          if (!nativeElement()) fallback();
        } else {
          fallback();
        }
      }
    } catch {
      if (!nativeElement()) fallback();
      else {
        notice.textContent = 'A teljes képernyőből a böngésző kilépési gombjával vagy az Escape billentyűvel léphetsz ki.';
        notice.hidden = false;
      }
    } finally {
      pending = false;
      update();
    }
  }
  function changed() {
    if (nativeElement()) { target.classList.remove('expanded'); notice.hidden = true; }
    update();
  }
  function escape(event) {
    if (event.key !== 'Escape') return;
    target.classList.remove('expanded');
    notice.hidden = true;
    update();
  }
  button.addEventListener('click', toggle);
  document.addEventListener('fullscreenchange', changed);
  document.addEventListener('webkitfullscreenchange', changed);
  document.addEventListener('keydown', escape);
  update();
  return () => {
    button.removeEventListener('click', toggle);
    document.removeEventListener('fullscreenchange', changed);
    document.removeEventListener('webkitfullscreenchange', changed);
    document.removeEventListener('keydown', escape);
  };
}