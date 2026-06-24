import sharp from 'sharp';
import { readFileSync } from 'fs';

const svgBuffer = readFileSync('public/pwa-icon.svg');
const sizes = [192, 512];

for (const size of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(`public/pwa-icon-${size}.png`);
  console.log(`Generated public/pwa-icon-${size}.png`);
}
