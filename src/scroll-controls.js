export function advanceScroll(state, delta, threshold) {
  if (!delta) return state;
  const direction = Math.sign(delta);
  const distance = Math.min(threshold, (direction === state.direction ? state.distance : 0) + Math.abs(delta));
  return { direction, distance, hidden: distance >= threshold ? direction > 0 : state.hidden };
}

export function installScrollControls({ window, document, button }) {
  const media = window.matchMedia('(orientation: landscape) and (max-height: 600px) and (pointer: coarse)');
  const controls = document.getElementById('controls');
  const indicator = document.getElementById('scroll-indicator');
  let state = { direction: 0, distance: 0, hidden: false };
  let previous = window.scrollY;
  let threshold = window.innerHeight / 2;
  let active = false;
  function render() {
    document.documentElement.classList.toggle('controls-hidden', active && state.hidden);
    controls.inert = active && state.hidden;
    indicator.hidden = !active;
    indicator.style.setProperty('--scroll-progress', String(state.distance / threshold));
    indicator.dataset.direction = state.direction > 0 ? 'down' : 'up';
    indicator.dataset.controls = state.hidden ? 'hidden' : 'visible';
    if (active) {
      button.title = state.hidden ? 'Vezérlők megjelenítése' : 'Vezérlők elrejtése';
      button.setAttribute('aria-label', button.title);
      button.setAttribute('aria-pressed', String(state.hidden));
      button.dataset.mode = 'scroll';
    }
  }
  function scroll() {
    if (!active) return;
    const position = Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight));
    state = advanceScroll(state, position - previous, threshold);
    previous = position;
    render();
  }
  function sync() {
    const next = media.matches;
    if (next !== active) {
      active = next;
      state = { direction: 0, distance: 0, hidden: false };
      document.documentElement.classList.toggle('mobile-scroll', active);
      document.documentElement.classList.remove('expanded');
      window.scrollTo(0, 0);
      previous = 0;
      document.dispatchEvent(new Event('controls-modechange'));
    }
    threshold = Math.max(1, window.innerHeight / 2);
    state.distance = Math.min(state.distance, threshold);
    render();
  }
  function toggle(event) {
    if (!active) return;
    event.stopImmediatePropagation();
    const target = state.hidden ? Math.max(0, window.scrollY - threshold) : window.scrollY + threshold;
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
  button.addEventListener('click', toggle, true);
  window.addEventListener('scroll', scroll, { passive: true });
  window.addEventListener('resize', sync);
  window.visualViewport?.addEventListener('resize', sync);
  media.addEventListener('change', sync);
  sync();
  return () => {
    button.removeEventListener('click', toggle, true);
    window.removeEventListener('scroll', scroll);
    window.removeEventListener('resize', sync);
    window.visualViewport?.removeEventListener('resize', sync);
    media.removeEventListener('change', sync);
    document.documentElement.classList.remove('mobile-scroll', 'controls-hidden');
    controls.inert = false;
    indicator.hidden = true;
  };
}