import { getHybridTrack, populateHybridSvg } from './hybrid.js';

async function renderComparison() {
  const configResponse = await fetch('/shell-config.json', { cache: 'no-store' });
  if (!configResponse.ok) throw new Error('A feladatkonfiguráció nem tölthető be.');
  const config = await configResponse.json();
  const trackNumber = new URLSearchParams(location.search).get('track') || '1';
  const trackId = `1710_${trackNumber}`;
  const track = getHybridTrack(trackId);
  if (!track) throw new Error('A track értéke 1 és 6 közötti szám lehet.');
  const prefix = new URL(config.lessonsPrefix, location.origin);
  prefix.pathname = `${prefix.pathname.replace(/\/+$/, '')}/`;
  const imageUrl = new URL(`1710/images_ms/${track.imageName}`, prefix).href;
  const original = document.getElementById('original');
  const svg = document.getElementById('hybrid');
  const readout = document.getElementById('scale-readout');

  original.src = imageUrl;
  if (!original.complete) {
    await new Promise((resolve, reject) => {
      original.addEventListener('load', resolve, { once: true });
      original.addEventListener('error', () => reject(new Error('A pályakép nem tölthető be.')), { once: true });
    });
  }
  if (!original.naturalWidth) throw new Error('A pályakép nem tölthető be.');
  populateHybridSvg(svg, original, trackId);
  document.getElementById('track-picker').value = trackNumber;
  document.querySelector('h1').textContent = `1710 / ${trackNumber}. pálya`;
  document.title = `1710 / ${trackNumber}. pálya / hibrid SVG POC`;

  const updateScale = () => {
    const scale = original.getBoundingClientRect().width / original.naturalWidth;
    readout.textContent = `Megjelenítés: ${Math.round(scale * 100)}% · SVG-szöveg: ${Math.round(58 * scale)} px`;
  };
  new ResizeObserver(updateScale).observe(original);
  updateScale();
  document.getElementById('track-picker').addEventListener('change', event => {
    location.search = `?track=${event.target.value}`;
  });
}

renderComparison().catch(error => {
  const message = document.getElementById('load-error');
  message.textContent = error.message || 'A POC kép nem tölthető be.';
  message.hidden = false;
});
