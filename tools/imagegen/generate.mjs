#!/usr/bin/env node
// SIENA plate generator — Gemini 3 Pro Image ("Nano Banana Pro").
//
//   npm run imagegen -- --era abbasid                       (use the preset for that era)
//   npm run imagegen -- --era abbasid --year "c. 850 CE" --scene "…" --ref art/reference/target-abbasid.png \
//                       --aspect 16:9 --out abbasid.jpg
//   npm run imagegen -- --era abbasid --dry-run             (show prompt + references, no API call)
//
// Results are written as CANDIDATES to art/plates/candidates/<era>/ — never over an approved plate.
// Promote one with:  npm run imagegen:approve -- <candidate file>
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import {
  ROOT, PLATES_DIR, CANDIDATES_DIR, DEFAULT_MODEL, ASPECTS, SIZES,
  loadEnv, presets, previousApproved, mimeOf, buildPrompt, generate,
} from "./lib.mjs";

const HELP = `
Usage: npm run imagegen -- --era <id> [options]

  --era <id>         era / plate id (e.g. abbasid). With only --era, the preset in tools/imagegen/presets.json is used
  --name <text>      era name shown in the prompt (default: preset)
  --year <text>      e.g. "c. 850 CE" (default: preset)
  --scene <text>     scene description (default: preset)
  --ref <file>       art-direction reference image (repeatable; default: preset references)
  --guide <file>     composition guide (default: preset guide, else art/plates/<id>.jpg, else art/reference/<id>.png)
  --no-guide         don't attach a composition guide
  --prev <file>      previous-era continuity image (default: the nearest earlier APPROVED plate)
  --no-prev          don't attach the previous approved plate
  --aspect <ratio>   ${ASPECTS.join(" ")} (default 16:9)
  --size <1K|2K|4K>  output resolution (default: preset, else 2K)
  --out <file>       final plate filename once approved, e.g. abbasid.jpg (default: preset / <id>.jpg)
  --count <n>        number of candidates to generate (default 1, max 4)
  --model <id>       default ${DEFAULT_MODEL} (or GEMINI_IMAGE_MODEL)
  --dry-run          print the prompt and references without calling the API
`;

function parseArgs(argv) {
  const a = { ref: [] };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (!k.startsWith("--")) continue;
    const key = k.slice(2);
    if (["dry-run", "no-guide", "no-prev", "help"].includes(key)) { a[key] = true; continue; }
    const v = argv[++i];
    if (v === undefined) throw new Error(`Missing value for ${k}`);
    if (key === "ref") a.ref.push(v); else a[key] = v;
  }
  return a;
}

const rel = (p) => path.relative(ROOT, p);
const abs = (p) => (path.isAbsolute(p) ? p : path.join(ROOT, p));

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.era) { console.log(HELP); process.exit(args.help ? 0 : 1); }
  loadEnv();

  const id = args.era.toLowerCase();
  const p = presets()[id] ?? {};
  const name = args.name ?? p.era ?? id;
  const year = args.year ?? p.year ?? "";
  const scene = args.scene ?? p.scene;
  if (!scene) throw new Error(`No --scene given and no preset for "${id}" in tools/imagegen/presets.json`);
  const aspect = args.aspect ?? p.aspect ?? "16:9";
  const size = (args.size ?? p.size ?? "2K").toUpperCase();
  const outName = args.out ?? p.out ?? `${id}.jpg`;
  const count = Math.max(1, Math.min(4, parseInt(args.count ?? "1", 10)));
  const model = args.model ?? process.env.GEMINI_IMAGE_MODEL ?? DEFAULT_MODEL;
  if (!ASPECTS.includes(aspect)) throw new Error(`--aspect must be one of ${ASPECTS.join(", ")}`);
  if (!SIZES.includes(size)) throw new Error(`--size must be one of ${SIZES.join(", ")}`);

  // Reference images, in the order the prompt describes them.
  const refs = [];
  const add = (file, role) => {
    const f = abs(file);
    if (!existsSync(f)) { console.warn(`  ! reference not found, skipped: ${file}`); return; }
    if (refs.some((r) => r.path === f)) return;
    refs.push({ path: f, role, mime: mimeOf(f) });
  };
  if (!args["no-guide"]) {
    const guide = args.guide ?? p.guide ?? [`art/plates/${id}.jpg`, `art/reference/${id}.png`].find((g) => existsSync(abs(g)));
    if (guide) add(guide, "COMPOSITION LOCK. Match this frame's camera position, lens, horizon height, the desk's size and position, and where the main objects and openings sit. Use it only for layout: replace its rendering style completely with true photographic realism and richer detail.");
  }
  if (!args["no-prev"]) {
    const prev = args.prev ? { path: abs(args.prev) } : previousApproved(id);
    if (prev) add(prev.path, "CONTINUITY. The approved image of the previous era: the same desk seen from the same chair. Keep the same camera, lens, desk proportions and framing, so the two images cross-dissolve seamlessly; change only what the new era requires.");
  }
  for (const r of args.ref.length ? args.ref : p.references ?? [])
    add(r, "ART DIRECTION. Match this image's level of photorealism, lighting mood, atmosphere and material quality. Do not copy its framing or layout.");

  const prompt = buildPrompt({ era: name, year, scene, roles: refs.map((r) => r.role) });

  console.log(`\nSIENA plate · ${name} · ${year}`);
  console.log(`model ${model} · ${aspect} · ${size} · ${count} candidate(s) · final name ${outName}`);
  refs.forEach((r, i) => console.log(`  image ${i + 1}: ${rel(r.path)}  — ${r.role.split(".")[0]}`));
  if (args["dry-run"]) { console.log("\n--- prompt ---\n" + prompt + "\n--------------\n(dry run: no API call)"); return; }

  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set. Put it in siena-web/.env.local (see .env.example) — never in the code.");

  const payloadRefs = refs.map((r) => ({ ...r, data: readFileSync(r.path).toString("base64") }));
  const dir = path.join(CANDIDATES_DIR, id);
  mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

  for (let n = 1; n <= count; n++) {
    process.stdout.write(`\ngenerating ${n}/${count} … (this can take a minute)\n`);
    const t0 = Date.now();
    const { images, notes, endpoint } = await generate({ key, model, prompt, refs: payloadRefs, aspect, size });
    const img = images[images.length - 1]; // the final image (earlier ones can be drafts)
    const ext = img.mime === "image/png" ? "png" : img.mime === "image/webp" ? "webp" : "jpg";
    const base = `${path.parse(outName).name}-${stamp}${count > 1 ? `-${n}` : ""}`;
    const file = path.join(dir, `${base}.${ext}`);
    writeFileSync(file, Buffer.from(img.data, "base64"));
    writeFileSync(path.join(dir, `${base}.json`), JSON.stringify({
      id, era: name, year, scene, aspect, size, model, endpoint, out: outName,
      references: refs.map((r) => ({ file: rel(r.path), role: r.role })),
      prompt, notes, createdAt: new Date().toISOString(), seconds: Math.round((Date.now() - t0) / 1000),
    }, null, 2));
    console.log(`✓ candidate saved: ${rel(file)}  (${Math.round((Date.now() - t0) / 1000)} s)`);
  }
  console.log(`\nNothing in ${rel(PLATES_DIR)}/ was changed. Review the candidate, then approve it with:`);
  console.log(`  npm run imagegen:approve -- <candidate file>\n`);
}

main().catch((e) => { console.error(`\n✗ ${e.message}\n`); process.exit(1); });
