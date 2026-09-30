#!/usr/bin/env node
// Final finishing pass for an approved-direction plate. The camera, composition, objects and
// lighting direction are never changed: only exposure, local detail and focus are adjusted.
//
//   node tools/imagegen/finish.mjs <input> <output.jpg> [--width 3840] [--regions abbasid]
//
// Steps: upscale (Lanczos) → darker left side for headline readability → subtle material
// detail on the desk → softer distant-city highlights → gentle depth of field behind the desk.
// Regions are normalised (0–1) rectangles for the plate; add a preset per era as needed.
import sharp from "sharp";
import path from "node:path";

const REGIONS = {
  // Abbasid: desk back edge ≈ 64% down; arch opening right of 65.5%; scales column on the far right.
  abbasid: { deskTop: 0.64, arch: { u0: 0.655, v1: 0.64 }, keep: [{ u0: 0.80, u1: 1.0, v0: 0.33, v1: 0.7 }] },
  // c. 1400 ledger room: no open city (the arch is walled in); keep the scales and the small window crisp-ish.
  ledger: { deskTop: 0.64, arch: { u0: 2, v1: 0 }, keep: [{ u0: 0.80, u1: 1.0, v0: 0.33, v1: 0.7 }] },
  // 1930s paper office: the street through the big window (right) softens; the banker's lamp stays crisp.
  // 1950s mechanical office: slatted window light on the right; keep the lamp, adding machine and phone crisp.
  mechanical: { deskTop: 0.64, arch: { u0: 0.74, v1: 0.55 }, keep: [{ u0: 0.66, u1: 1.0, v0: 0.36, v1: 0.8 }] },
  // 2000s internet office: city through the glass behind the desk softens; keep the LCD and phones crisp.
  internet: { deskTop: 0.65, arch: { u0: 0.18, v1: 0.6 }, keep: [{ u0: 0.2, u1: 0.82, v0: 0.36, v1: 0.8 }] },
  paper: { deskTop: 0.64, arch: { u0: 0.76, v1: 0.52 }, keep: [{ u0: 0.66, u1: 0.84, v0: 0.3, v1: 0.7 }] },
};

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const [input, output] = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
if (!input || !output) { console.log("Usage: node tools/imagegen/finish.mjs <input> <output.jpg> [--width 3840] [--regions abbasid]"); process.exit(1); }
const W = parseInt(opt("width", "3840"), 10);
const R = REGIONS[opt("regions", path.basename(output).split(/[-.]/)[0])] ?? REGIONS.abbasid;

const smooth = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

const meta = await sharp(input).metadata();
const H = Math.round((W * meta.height) / meta.width);
const base = sharp(input).resize(W, H, { kernel: "lanczos3" }).removeAlpha();
const raw = async (s) => (await s.raw().toBuffer({ resolveWithObject: true })).data;
const [src, blurS, blurL, sharp1] = await Promise.all([
  raw(base.clone()),
  raw(base.clone().blur(1.1 * (W / 1920))),        // gentle focus falloff
  raw(base.clone().blur(2.2 * (W / 1920))),        // distant city
  raw(base.clone().sharpen({ sigma: 0.9 * (W / 1920), m1: 0.4, m2: 1.6 })), // material detail
]);

const out = Buffer.alloc(src.length);
for (let y = 0; y < H; y++) {
  const v = y / H;
  const desk = smooth(R.deskTop - 0.015, R.deskTop + 0.03, v);            // 0 above desk → 1 on desk
  for (let x = 0; x < W; x++) {
    const u = x / W, i = (y * W + x) * 3;
    const keep = R.keep.some((k) => u >= k.u0 && u <= k.u1 && v >= k.v0 && v <= k.v1) ? 1 : 0;
    const city = smooth(R.arch.u0 - 0.01, R.arch.u0 + 0.02, u) * (1 - smooth(R.arch.v1 - 0.03, R.arch.v1, v)) * (1 - keep);
    const back = (1 - desk) * (1 - keep) * (1 - city);                      // interior behind the desk
    const left = 1 - 0.2 * (1 - smooth(0.0, 0.46, u)) * (1 - 0.35 * desk); // up to −20% at the left edge
    let lum = 0;
    const px = [0, 1, 2].map((c) => {
      let p = src[i + c];
      p = p + (sharp1[i + c] - p) * 0.75 * desk;                           // wood, paper, brass detail
      p = p + (blurS[i + c] - p) * 0.45 * back;                            // soft falloff behind the desk
      p = p + (blurL[i + c] - p) * 0.6 * city;                             // distant city softer
      return p;
    });
    lum = (0.2126 * px[0] + 0.7152 * px[1] + 0.0722 * px[2]) / 255;
    const hi = 1 - 0.16 * city * smooth(0.55, 0.95, lum);                  // compress bright city lights
    for (let c = 0; c < 3; c++) out[i + c] = Math.max(0, Math.min(255, Math.round(px[c] * left * hi)));
  }
}
await sharp(out, { raw: { width: W, height: H, channels: 3 } })
  .jpeg({ quality: 94, chromaSubsampling: "4:4:4", mozjpeg: true })
  .toFile(output);
console.log(`✓ finished ${path.basename(output)} (${W}×${H})`);
