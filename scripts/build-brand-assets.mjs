// Derives web assets from the ONE official logo file: crop + background removal + format conversion.
// The mark and wordmark pixels are not redrawn or recoloured. The logo's near-black field is converted
// to transparency ("un-screen": alpha from channel maximum above the field level), so the logo sits on
// any SIENA navy surface without a visible box. Composited over black it matches the original.
// Run: npm run assets
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "brand/SIENA logo.JPG"; // 1254 x 1254 official master
const OUT = "public/brand";
const FIELD = 30; // brightest value of the logo's dark background field (sampled: ~ rgb(5,12,28))
mkdirSync(OUT, { recursive: true });

const crops = {
  "siena-logo": { region: null, widths: [1254, 720] },
  "siena-symbol": { region: { left: 325, top: 170, width: 600, height: 600 }, widths: [600, 160] },
  "siena-lockup": { region: { left: 175, top: 160, width: 904, height: 850 }, widths: [904, 560] },
  "siena-wordmark": { region: { left: 200, top: 800, width: 845, height: 105 }, widths: [845, 420] },
};

async function transparent(region) {
  let s = sharp(SRC).removeAlpha();
  if (region) s = s.extract(region);
  const { data, info } = await s.raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const m = Math.max(r, g, b);
    const a = Math.max(0, Math.min(1, (m - FIELD) / (255 - FIELD)));
    if (a <= 0) { out[j + 3] = 0; continue; }
    // un-premultiply against black so edges keep their original hue
    const k = 255 / m;
    out[j] = Math.min(255, Math.round(r * k));
    out[j + 1] = Math.min(255, Math.round(g * k));
    out[j + 2] = Math.min(255, Math.round(b * k));
    out[j + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

for (const [name, { region, widths }] of Object.entries(crops)) {
  const png = await transparent(region);
  for (const w of widths) {
    const suffix = w === widths[0] ? "" : `-${w}`;
    await sharp(png).resize({ width: w }).avif({ quality: 72, effort: 6 }).toFile(`${OUT}/${name}${suffix}.avif`);
    await sharp(png).resize({ width: w }).webp({ quality: 90, alphaQuality: 90 }).toFile(`${OUT}/${name}${suffix}.webp`);
  }
}
// Favicon / app icon and social image keep the original dark field
await sharp(SRC).extract(crops["siena-symbol"].region).resize(256).png().toFile("app/icon.png");
await sharp(SRC).resize(1200, 630, { fit: "contain", background: "#03060e" }).jpeg({ quality: 85 }).toFile(`${OUT}/og.jpg`);
console.log("Brand assets written to", OUT);
