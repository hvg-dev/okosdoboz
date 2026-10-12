const rows = [
  { x: 286, y: 300, sourceY: 340 },
  { x: 1891, y: 300, sourceY: 340 },
  { x: 286, y: 795, sourceY: 650 },
  { x: 1894, y: 795, sourceY: 650 }
];

export const hybridTracks = {
  '1710_1': { imageName: '48be45391e62992eb92fdd71dd5b42a3.png', text: ['Most nem hallom, mert', 'Most meg fog szakadni, mert.', 'Most nem tudunk beszélni, mert', 'Most leteszem, mert'], widths: [739, 950, 1056, 669] },
  '1710_2': { imageName: '31cf114cb4f3de2e58a6f5ede0856ad6.png', text: ['Az én koromban:', 'Az én koromban:', 'Az én koromban:', 'Az én koromban:'], widths: [519, 519, 519, 519] },
  '1710_3': { imageName: '9707af5586524aabf5572f278a798e1b.png', text: ['Neve:', 'Neve:', 'Neve:', 'Neve:'], widths: [167, 167, 167, 167] },
  '1710_4': { imageName: '56a21850f7b016b68fe3999f7d068268.png', text: ['Az én királyságomban', 'Az én királyságomban', 'Az én királyságomban', 'Az én királyságomban'], widths: [704, 704, 704, 704] },
  '1710_5': { imageName: '939c522c20cc72326915bf86f03b9dc6.png', text: ['Van aki', 'Van aki', 'Van aki', 'Van aki'], widths: [242, 242, 242, 242] },
  '1710_6': { imageName: 'c102baa3550d1d9f00b9d3d389a87e3d.png', text: ['A szerelmes nő', 'A szerelmes nő', 'A szerelmes nő', 'A szerelmes nő'], widths: [493, 493, 493, 493] }
};

export function getHybridTrack(trackId) {
  return hybridTracks[String(trackId)];
}

function svgElement(name, attributes = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}

export function populateHybridSvg(svg, original, trackId) {
  const track = getHybridTrack(trackId);
  if (!track) throw new Error(`Nincs SVG-leírás ehhez a pályához: ${trackId}`);
  const raster = document.createElement('canvas');
  raster.width = 3150;
  raster.height = 1350;
  raster.getContext('2d').drawImage(original, 0, 0, raster.width, raster.height);
  svg.append(svgElement('image', {
    href: raster.toDataURL('image/png'),
    x: 0,
    y: 0,
    width: 3150,
    height: 1350,
    preserveAspectRatio: 'none',
    'data-layer': 'raster-illustration'
  }));

  const prompts = rows.map((row, index) => ({ ...row, text: track.text[index], width: track.widths[index] }));
  prompts.forEach(prompt => {
    const patch = { x: prompt.x - 6, y: prompt.y - 56, width: prompt.width + 18, height: 78, sourceY: prompt.sourceY };
    const paper = document.createElement('canvas');
    paper.width = patch.width;
    paper.height = patch.height;
    paper.getContext('2d').drawImage(raster, patch.x, patch.sourceY, patch.width, patch.height, 0, 0, patch.width, patch.height);
    svg.append(svgElement('image', {
      href: paper.toDataURL('image/png'),
      x: patch.x,
      y: patch.y,
      width: patch.width,
      height: patch.height,
      'data-layer': 'raster-text-mask'
    }));
  });

  prompts.forEach((prompt, index) => {
    const text = svgElement('text', {
      x: prompt.x,
      y: prompt.y,
      fill: '#11100e',
      'font-family': 'Courier New, monospace',
      'font-size': 58,
      'font-weight': 600,
      'dominant-baseline': 'alphabetic',
      textLength: prompt.width,
      lengthAdjust: 'spacingAndGlyphs',
      'data-layer': 'native-svg-text',
      'data-prompt': String(index + 1)
    });
    text.textContent = prompt.text;
    svg.append(text);
  });
}

export async function createHybridSvgUrl(original, trackId) {
  const svg = svgElement('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 3150 1350' });
  populateHybridSvg(svg, original, trackId);
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }));
  const verificationImage = new Image();
  await new Promise((resolve, reject) => {
    verificationImage.onload = resolve;
    verificationImage.onerror = () => reject(new Error('A hibrid SVG nem jeleníthető meg.'));
    verificationImage.src = url;
  });
  return url;
}

export async function loadOriginalImage(imageUrl) {
  const image = new Image();
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = () => reject(new Error('A pályakép nem tölthető be.'));
    image.src = imageUrl;
  });
  return image;
}