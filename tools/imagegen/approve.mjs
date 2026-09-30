#!/usr/bin/env node
// Promote a generated candidate to an approved plate in art/plates/.
//
//   npm run imagegen:approve -- art/plates/candidates/abbasid/abbasid-2026-09-30T12-00-00.png
//   npm run imagegen:approve -- <candidate> --replace     (explicitly replace an existing approved plate)
//
// An existing plate is never overwritten without --replace; when replaced, the old file is kept in
// art/plates/_superseded/. The approval is recorded in art/plates/approved.json, and the next era's
// generation uses this plate as its continuity reference.
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { ROOT, PLATES_DIR, SUPERSEDED_DIR, APPROVED_FILE, approved } from "./lib.mjs";

/** Copy src → out, converting the format to match out's extension (sharp, or macOS "sips" as a fallback). */
async function convert(src, out) {
  const want = path.extname(out).toLowerCase().replace("jpeg", "jpg");
  if (want === path.extname(src).toLowerCase().replace("jpeg", "jpg")) { copyFileSync(src, out); return; }
  try {
    const sharp = (await import("sharp")).default;
    const img = sharp(src);
    if (want === ".jpg") await img.jpeg({ quality: 94, chromaSubsampling: "4:4:4" }).toFile(out);
    else if (want === ".webp") await img.webp({ quality: 92 }).toFile(out);
    else await img.png().toFile(out);
    return;
  } catch (e) {
    if (process.platform !== "darwin") throw new Error(`Could not convert the image (${e.message}). Try: npm rebuild sharp`);
  }
  const fmt = { ".jpg": "jpeg", ".png": "png", ".webp": "webp" }[want] ?? "jpeg";
  try {
    execFileSync("sips", ["-s", "format", fmt, ...(fmt === "jpeg" ? ["-s", "formatOptions", "94"] : []), src, "--out", out], { stdio: "ignore" });
  } catch (e) {
    rmSync(out, { force: true });
    throw new Error(`Could not convert the image to ${want}. Try: npm rebuild sharp`);
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const replace = argv.includes("--replace");
  const cand = argv.find((a) => !a.startsWith("--"));
  if (!cand) { console.log("Usage: npm run imagegen:approve -- <candidate file> [--replace]"); process.exit(1); }
  const src = path.isAbsolute(cand) ? cand : path.join(ROOT, cand);
  if (!existsSync(src)) throw new Error(`Candidate not found: ${cand}`);
  const metaFile = src.replace(/\.(png|jpe?g|webp)$/i, ".json");
  const meta = existsSync(metaFile) ? JSON.parse(readFileSync(metaFile, "utf8")) : {};
  const outName = meta.out ?? `${path.basename(path.dirname(src))}.jpg`;
  const id = meta.id ?? path.parse(outName).name;
  const dest = path.join(PLATES_DIR, outName);

  if (existsSync(dest) && !replace) {
    console.error(`\n✗ ${path.relative(ROOT, dest)} already exists (an approved plate).`);
    console.error(`  Nothing was changed. To replace it, run the same command with --replace.\n`);
    process.exit(2);
  }
  // 1) prepare the new file next to the destination (convert e.g. PNG → JPG); nothing is touched if this fails
  const tmp = path.join(PLATES_DIR, `.incoming-${process.pid}${path.extname(outName)}`);
  await convert(src, tmp);

  // 2) keep the plate being replaced, 3) move the new one into place
  if (existsSync(dest)) {
    mkdirSync(SUPERSEDED_DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const keep = path.join(SUPERSEDED_DIR, `${path.parse(outName).name}-${stamp}${path.extname(outName)}`);
    copyFileSync(dest, keep);
    console.log(`  previous plate kept at ${path.relative(ROOT, keep)}`);
  }
  renameSync(tmp, dest);

  const reg = approved();
  reg.plates = reg.plates ?? {};
  reg.plates[id] = {
    file: outName, era: meta.era, year: meta.year, model: meta.model,
    candidate: path.relative(ROOT, src), approvedAt: new Date().toISOString(),
  };
  writeFileSync(APPROVED_FILE, JSON.stringify(reg, null, 2) + "\n");
  console.log(`✓ approved: ${path.relative(ROOT, dest)}  (recorded in ${path.relative(ROOT, APPROVED_FILE)})`);
  console.log(`  Run "npm run plates" (or npm run dev / build) to put it on the site.\n`);
}

main().catch((e) => { console.error(`\n✗ ${e.message}\n`); process.exit(1); });
