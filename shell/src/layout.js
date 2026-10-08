export function observeLayout(root) {
  const player = root.carco.playeritems.player;
  const main = player.querySelector('.drwmsg-flex-container > .drwmsg');
  const game = root.parentElement;
  const container = document.querySelector('.lesson-container');
  const controls = document.getElementById('controls');
  let frame;
  let width = 0;
  function measure() {
    frame = undefined;
    const available = container.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.min(available.width - 8, (available.height - 14) * 3150 / 1350));
    if (Math.abs(width - nextWidth) > 1) {
      width = nextWidth;
      document.getElementById('odPlayer').style.width = width + 'px';
      window.dispatchEvent(new Event('resize'));
    }
    const height = Math.ceil(game.getBoundingClientRect().height);
    for (const item of [player, main]) {
      if (Math.abs(item.getBoundingClientRect().height - height) > 1) item.style.height = height + 'px';
      if (item.style.minHeight !== '0px') item.style.minHeight = '0px';
    }
    const layer = root.carco.playeritems.preload_layer;
    const top = (game.getBoundingClientRect().top - player.getBoundingClientRect().top) + 'px';
    const left = (game.getBoundingClientRect().left - player.getBoundingClientRect().left) + 'px';
    if (layer.style.top !== top) layer.style.top = top;
    if (layer.style.left !== left) layer.style.left = left;
  }
  function schedule() {
    if (frame !== undefined) return;
    frame = document.hidden ? setTimeout(measure, 100) : requestAnimationFrame(measure);
  }
  const resize = new ResizeObserver(schedule);
  resize.observe(container);
  resize.observe(game);
  const mutation = new MutationObserver(schedule);
  for (const item of [player, controls]) mutation.observe(item, { attributes: true, childList: true, subtree: true, attributeFilter: ['style', 'class'] });
  window.addEventListener('resize', schedule);
  schedule();
  return () => { resize.disconnect(); mutation.disconnect(); cancelAnimationFrame(frame); clearTimeout(frame); window.removeEventListener('resize', schedule); };
}