import { mkdir, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const output = Buffer.alloc(data.length + 12);
  output.writeUInt32BE(data.length);
  name.copy(output, 4);
  data.copy(output, 8);
  output.writeUInt32BE(crc32(Buffer.concat([name, data])), data.length + 8);
  return output;
}

const directory = new URL('../assets/', import.meta.url);
await mkdir(directory, { recursive: true });
for (const size of [180, 192, 512]) {
  const pixels = Buffer.alloc(size * (size * 3 + 1));
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const horizontal = column / size;
      const vertical = row / size;
      const box = horizontal > 0.23 && horizontal < 0.77 && vertical > 0.23 && vertical < 0.77;
      const inner = horizontal > 0.32 && horizontal < 0.68 && vertical > 0.32 && vertical < 0.68;
      const accent = horizontal > 0.60 && horizontal < 0.77 && vertical > 0.23 && vertical < 0.40;
      const color = accent ? [241, 193, 67] : box && !inner ? [255, 255, 255] : [19, 127, 96];
      const offset = row * (size * 3 + 1) + 1 + column * 3;
      pixels.set(color, offset);
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 2;
  await writeFile(new URL(`icon-${size}.png`, directory), Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header), chunk('IDAT', deflateSync(pixels)), chunk('IEND', Buffer.alloc(0))
  ]));
}