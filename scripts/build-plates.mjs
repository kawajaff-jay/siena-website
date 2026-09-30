// Optimises photographic plates: art/plates/<id>.(jpg|jpeg|png|webp|tif) → public/eras/<id>.(webp|avif) + -1280 variants.
// Crops/resizes to 16:9 (centre-weighted) so every plate matches the stage composition.
// Run: npm run plates
import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const SRC = "art/plates";
const OUT = "public/eras";
mkdirSync(OUT, { recursive: true });
if (!existsSync(SRC)) { console.log(`No ${SRC} folder yet — nothing to do.`); process.exit(0); }

// wide sizes per plate (the prologue opens zoomed in, so it needs more pixels)
const WIDE = { abbasid: 3840, record: 3840 };

const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f));
for (const f of files) {
  const id = path.parse(f).name.toLowerCase();
  const input = path.join(SRC, f);
  const done = `${OUT}/${id}-1280.avif`;
  if (existsSync(done) && statSync(done).mtimeMs > statSync(input).mtimeMs) { console.log(`· ${id} (up to date)`); continue; }
  const meta = await sharp(input).metadata();
  const w = Math.min(WIDE[id] ?? 2560, meta.width ?? 2560);
  const h = Math.round((w * 9) / 16);
  const base = sharp(input).rotate().resize(w, h, { fit: "cover", position: "centre" });
  await base.clone().webp({ quality: 80, effort: 5 }).toFile(`${OUT}/${id}.webp`);
  await base.clone().avif({ quality: 55, effort: 5 }).toFile(`${OUT}/${id}.avif`);
  const small = sharp(input).rotate().resize(1280, 720, { fit: "cover", position: "centre" });
  await small.clone().webp({ quality: 78 }).toFile(`${OUT}/${id}-1280.webp`);
  await small.clone().avif({ quality: 52 }).toFile(`${OUT}/${id}-1280.avif`);
  if ((meta.width ?? 0) < w || Math.abs((meta.width ?? 16) / (meta.height ?? 9) - 16 / 9) > 0.02)
    console.warn(`  ! ${f}: source is ${meta.width}×${meta.height}; plates should be 16:9 and at least ${WIDE[id] ?? 2560}px wide.`);
  console.log(`✓ ${id}`);
}
console.log(`Done. ${files.length} plate(s) written to ${OUT}. Rebuild or refresh the dev server to see them.`);
