export function observeLayout(root) {
  const player = root.carco.playeritems.player;
  const main = player.querySelector('.drwmsg-flex-container > .drwmsg');
  const game = root.parentElement;
  const container = document.querySelector('.lesson-container');
  let frame;
  let width = 0;
  function measure() {
    const nextWidth = container.clientWidth;
    if (Math.abs(width - nextWidth) > 1) {
      width = nextWidth;
      window.dispatchEvent(new Event('resize'));
    }
    const height = Math.ceil([...main.children].filter(item => getComputedStyle(item).display !== 'none').reduce((sum, item) => {
      const style = getComputedStyle(item);
      return sum + item.getBoundingClientRect().height + parseFloat(style.marginTop || 0) + parseFloat(style.marginBottom || 0);
    }, 0));
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
  function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); }
  const resize = new ResizeObserver(schedule);
  resize.observe(container);
  for (const item of main.children) resize.observe(item);
  const mutation = new MutationObserver(schedule);
  mutation.observe(player, { attributes: true, childList: true, subtree: true, attributeFilter: ['style', 'class'] });
  window.addEventListener('resize', schedule);
  schedule();
  return () => { resize.disconnect(); mutation.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', schedule); };
}