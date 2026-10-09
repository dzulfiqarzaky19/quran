// Renders the app icons from the SVG below. Re-run after changing the mark.
//
//   node scripts/generate-icons.mjs
//
// The mark stays inside the middle 80% so the same image works as a maskable icon.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <mask id="crescent">
    <circle cx="246" cy="256" r="132" fill="#fff"/>
    <circle cx="296" cy="226" r="112" fill="#000"/>
  </mask>
  <rect width="512" height="512" fill="#131315"/>
  <rect width="512" height="512" fill="#C2C1FF" mask="url(#crescent)"/>
</svg>`;

const ICONS = [
  { file: 'public/icon-192.png', size: 192 },
  { file: 'public/icon-512.png', size: 512 },
  { file: 'src/app/apple-icon.png', size: 180 },
];

for (const { file, size } of ICONS) {
  await sharp(Buffer.from(SVG), { density: 300 }).resize(size, size).png().toFile(path.join(ROOT, file));
  console.log(`${file} (${size}x${size})`);
}
