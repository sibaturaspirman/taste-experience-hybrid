import sharp from "sharp";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "icons");
mkdirSync(outDir, { recursive: true });

async function icon(size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#03398f"/><stop offset="100%" stop-color="#021a5c"/>
  </linearGradient></defs>
  <rect width="${size}" height="${size}" fill="url(#g)"/>
  <text x="50%" y="46%" text-anchor="middle" fill="#fff" font-family="system-ui,sans-serif" font-weight="700" font-size="${size * 0.11}">TASTE</text>
  <text x="50%" y="62%" text-anchor="middle" fill="#43c8ff" font-family="system-ui,sans-serif" font-weight="700" font-size="${size * 0.085}">EXP</text>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(join(outDir, `icon-${size}.png`));
}

await icon(192);
await icon(512);
console.log("icons written to", outDir);