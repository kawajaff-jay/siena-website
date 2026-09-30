// Shared helpers for the SIENA plate generator (Gemini 3 Pro Image / "Nano Banana Pro").
// No API key is ever written to disk by this code: it is read from the environment
// (GEMINI_API_KEY), which may be loaded from .env.local / .env at the project root.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const PLATES_DIR = path.join(ROOT, "art/plates");
export const CANDIDATES_DIR = path.join(PLATES_DIR, "candidates");
export const SUPERSEDED_DIR = path.join(PLATES_DIR, "_superseded");
export const APPROVED_FILE = path.join(PLATES_DIR, "approved.json");
export const PRESETS_FILE = path.join(ROOT, "tools/imagegen/presets.json");

export const DEFAULT_MODEL = "gemini-3-pro-image";
export const ASPECTS = ["1:1", "3:2", "2:3", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"];
export const SIZES = ["1K", "2K", "4K"];

/** Load KEY=VALUE lines from .env.local then .env (existing environment variables win). */
export function loadEnv() {
  for (const name of [".env.local", ".env"]) {
    const file = path.join(ROOT, name);
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m || line.trim().startsWith("#")) continue;
      let v = m[2];
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (process.env[m[1]] === undefined) process.env[m[1]] = v;
    }
  }
}

export function readJson(file, fallback) {
  try { return JSON.parse(readFileSync(file, "utf8")); } catch { return fallback; }
}

export const presets = () => readJson(PRESETS_FILE, {});
export const approved = () => readJson(APPROVED_FILE, { plates: {} });

/** The approved plate for the nearest earlier era (timeline order = presets.json order). */
export function previousApproved(id) {
  const order = Object.keys(presets());
  const list = approved().plates ?? {};
  const i = order.indexOf(id);
  for (let k = (i === -1 ? order.length : i) - 1; k >= 0; k--) {
    const entry = list[order[k]];
    if (entry && existsSync(path.join(PLATES_DIR, entry.file))) return { id: order[k], path: path.join(PLATES_DIR, entry.file) };
  }
  return null;
}

export function mimeOf(file) {
  const ext = path.extname(file).toLowerCase();
  return { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" }[ext] ?? "application/octet-stream";
}

/** The house style: identical camera and look for every era. */
export function buildPrompt({ era, year, scene, roles }) {
  const refLines = roles.map((r, i) => `Image ${i + 1} — ${r}`).join("\n");
  return [
    `Create one photorealistic, cinematic photograph: ${era}, ${year}.`,
    "",
    "SCENE",
    scene,
    "",
    "CAMERA AND COMPOSITION (identical for every era of this series — do not change them)",
    "- First-person view of a person seated at a large desk, eye level about 40 cm above the desk top, looking straight ahead; no tilt, no dutch angle, level horizon.",
    "- Wide 24–28 mm full-frame lens. The desk's near edge runs along the bottom of the frame, the desk top fills roughly the lower third, and its back edge runs horizontally about two-thirds of the way down the frame.",
    "- The key desk objects sit slightly right of centre; the left third of the frame is darker and calmer (headline text will be placed there).",
    "- Real depth: sharp desk foreground, the room and the view beyond falling into soft, natural depth of field.",
    "",
    "LOOK",
    "- A still from a high-end film or premium commercial, shot on a large-format digital cinema camera: physically accurate light, motivated practical sources, soft shadows, atmospheric haze, subtle film grain, rich but restrained colour.",
    "- Real materials: wood grain and polish, paper fibre and wear, brass patina, glass reflections, metal, stone — with mild, believable imperfections and subtle dust.",
    "- Not an illustration, painting, cartoon, anime, concept art, 3D-render or plastic CGI look. No text, letters, captions, logos, watermarks, UI overlays or borders. Any writing on paper or screens must be abstract and illegible. Background people are small, out of focus and never look at the camera.",
    ...(roles.length ? ["", "REFERENCE IMAGES (attached after this text, in this order)", refLines] : []),
  ].join("\n");
}

/** Find every base64 image in a (possibly unfamiliar) response shape. */
function findImages(node, out = []) {
  if (!node || typeof node !== "object") return out;
  if (Array.isArray(node)) { node.forEach((n) => findImages(n, out)); return out; }
  const mime = node.mimeType ?? node.mime_type;
  if (typeof node.data === "string" && typeof mime === "string" && mime.startsWith("image/") && node.data.length > 1000) out.push({ mime, data: node.data });
  for (const v of Object.values(node)) if (v && typeof v === "object") findImages(v, out);
  return out;
}

function findText(node, out = []) {
  if (!node || typeof node !== "object") return out;
  if (Array.isArray(node)) { node.forEach((n) => findText(n, out)); return out; }
  if (typeof node.text === "string" && !node.thought) out.push(node.text);
  for (const v of Object.values(node)) if (v && typeof v === "object") findText(v, out);
  return out;
}

async function post(url, key, body, timeoutMs) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = { raw: text.slice(0, 2000) }; }
    return { status: res.status, json };
  } finally {
    clearTimeout(t);
  }
}

/**
 * Generate one image. Tries the standard generateContent endpoint first and falls back to the
 * newer Interactions endpoint if the model is only served there.
 * refs: [{ path, mime, data(base64) }]
 */
export async function generate({ key, model, prompt, refs, aspect, size, timeoutMs = 300_000 }) {
  const base = "https://generativelanguage.googleapis.com/v1beta";
  const a = await post(`${base}/models/${encodeURIComponent(model)}:generateContent`, key, {
    contents: [{ role: "user", parts: [{ text: prompt }, ...refs.map((r) => ({ inline_data: { mime_type: r.mime, data: r.data } }))] }],
    generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: aspect, imageSize: size } },
  }, timeoutMs);
  let images = a.status === 200 ? findImages(a.json) : [];
  if (images.length) return { images, notes: findText(a.json), endpoint: "generateContent" };

  const unsupported = a.status === 404 || (a.status === 400 && /not (supported|found)|generateContent/i.test(JSON.stringify(a.json)));
  if (!unsupported) throw apiError(a);

  const b = await post(`${base}/interactions`, key, {
    model,
    input: [{ type: "text", text: prompt }, ...refs.map((r) => ({ type: "image", mime_type: r.mime, data: r.data }))],
    response_format: { type: "image", mime_type: "image/png", aspect_ratio: aspect, image_size: size },
  }, timeoutMs);
  images = b.status === 200 ? findImages(b.json) : [];
  if (images.length) return { images, notes: findText(b.json), endpoint: "interactions" };
  throw apiError(b);
}

function apiError({ status, json }) {
  const msg = json?.error?.message ?? json?.message ?? JSON.stringify(json).slice(0, 800);
  const hint =
    status === 401 || status === 403 ? " (check GEMINI_API_KEY and that the key has access to this model)" :
    status === 429 ? " (rate limit or quota — wait a minute or check billing)" : "";
  return new Error(`Gemini API error ${status}: ${msg}${hint}`);
}
