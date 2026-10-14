export function advanceScroll(state, delta, threshold) {
  if (!delta) return state;
  const direction = Math.sign(delta);
  const distance = Math.min(threshold, (direction === state.direction ? state.distance : 0) + Math.abs(delta));
  return { direction, distance, hidden: distance >= threshold ? direction > 0 : state.hidden };
}

const THRESHOLD = 32;

export function installMobileLayout({ window, document, button }) {
  const html = document.documentElement;
  const header = document.querySelector('.shell-header');
  const tab = document.getElementById('bar-tab');
  const lesson = document.querySelector('.lesson-container');
  const landscape = window.matchMedia('(orientation: landscape) and (max-height: 600px) and (pointer: coarse)');
  const portrait = window.matchMedia('(orientation: portrait) and (max-width: 600px)');
  const parts = ['.drwmsg-check-box'].map(selector => ({ selector, node: null, marker: document.createComment(selector) }));
  let mode = null;
  let state = { direction: 0, distance: 0, hidden: false };
  let peek = false;
  let previous = window.scrollY;

  function canFullscreen() {
    const standalone = Boolean(window.navigator.standalone) || window.matchMedia('(display-mode: standalone)').matches;
    return !standalone && Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  }
  function place() {
    for (const part of parts) {
      part.node ||= document.querySelector('#controls ' + part.selector);
      if (!part.node) continue;
      if (!part.marker.parentNode) part.node.before(part.marker);
      if (mode) { if (part.node.parentNode !== header) button.before(part.node); }
      else if (part.node.parentNode === header) part.marker.before(part.node);
    }
  }
  function render() {
    const hidden = Boolean(mode) && !peek && state.hidden && window.scrollY > header.offsetHeight;
    html.classList.toggle('bar-hidden', hidden);
    header.inert = hidden;
    tab.hidden = !hidden;
    button.hidden = Boolean(mode) && !canFullscreen();
  }
  function scroll() {
    if (!mode) return;
    const position = Math.max(0, Math.min(window.scrollY, html.scrollHeight - window.innerHeight));
    state = advanceScroll(state, position - previous, THRESHOLD);
    if (peek && state.direction > 0 && state.distance >= THRESHOLD) peek = false;
    previous = position;
    render();
  }
  function sync() {
    const next = portrait.matches ? 'portrait' : landscape.matches ? 'landscape' : null;
    if (next !== mode) {
      mode = next;
      state = { direction: 0, distance: 0, hidden: false };
      peek = false;
      html.classList.toggle('mobile-layout', Boolean(mode));
      html.classList.toggle('mobile-portrait', mode === 'portrait');
      html.classList.toggle('mobile-landscape', mode === 'landscape');
      html.classList.remove('expanded');
      window.scrollTo(0, 0);
      previous = 0;
      document.dispatchEvent(new Event('controls-modechange'));
    }
    place();
    render();
  }
  function reveal() {
    peek = true;
    state = { direction: 0, distance: 0, hidden: true };
    render();
  }
  function dismiss() {
    if (!peek) return;
    peek = false;
    render();
  }
  tab.addEventListener('click', reveal);
  lesson.addEventListener('pointerdown', dismiss, true);
  window.addEventListener('scroll', scroll, { passive: true });
  window.addEventListener('resize', sync);
  portrait.addEventListener('change', sync);
  landscape.addEventListener('change', sync);
  sync();
  return {
    refresh: sync,
    dispose() {
      tab.removeEventListener('click', reveal);
      lesson.removeEventListener('pointerdown', dismiss, true);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', sync);
      portrait.removeEventListener('change', sync);
      landscape.removeEventListener('change', sync);
      mode = null;
      place();
      html.classList.remove('mobile-layout', 'mobile-portrait', 'mobile-landscape', 'bar-hidden');
      header.inert = false;
      tab.hidden = true;
      button.hidden = false;
    }
  };
}
