# SIENA — The Evolution of Business Systems
### Homepage architecture · v1

> **ONE DESK. ONE BUSINESS. CENTURIES OF EVOLUTION.**
> Final statement: **FROM PAPER. TO SOFTWARE. TO INTELLIGENCE.** — SIENA · AI SOLUTIONS & SYSTEMS

---

## 1 · Page structure

| # | Section | Component | Scroll behaviour |
|---|---------|-----------|------------------|
| 0 | Fixed header (logo crop · Solutions · Contact · "Build Your AI System") | `Header` | Fixed, fades in after hero |
| 1 | Hero: logo, *THE EVOLUTION OF BUSINESS SYSTEMS*, scroll cue | `Hero` | Normal flow, 100svh. Logo drifts back as you leave |
| 2 | **The Evolution** — one sticky stage, 12 chapters | `EvolutionTimeline` | Sticky 100svh stage inside a ~1,500vh track; one master timeline scrubbed by scroll |
| 2.1 | Prologue I: Baghdad market, caravans, trade (c. 750–1258 CE) | `HistoricalPrologue` | Camera starts "through the arch" and pulls back to reveal the desk |
| 2.2 | Prologue II: the scribe's record (ink stroke begins) | `HistoricalPrologue` + `DeskScene` | Qalam writes the first line: the **thread** is born |
| 2.3 | Centuries pass: manuscript → ledger → printed page → account book → typed page | `DeskScene` (document morph) | Year counter rolls 1258 → 1920 |
| 2.4–2.10 | 1920s Paper · 1950s Mechanical · 1970s Computer · 1990s Enterprise · 2000s Internet · 2010s Cloud · 2020–25 Automation | `EvolutionScene` + `DeskScene` + `SystemNodes` | Same desk, objects/architecture/light replaced around it |
| 2.11 | 2026 — The AI Revolution: systems converge; thread draws the SIENA symbol; logo reveal | `AIConvergence` | Longest chapter (~2× weight) |
| 2.12 | 2030+ — The Autonomous Business: one continuous workflow, human-directed | `FutureWorkflow` | Nodes light in sequence along the thread |
| 3 | Final reveal: *Centuries…* → *100 years…* → FROM PAPER. TO SOFTWARE. TO **INTELLIGENCE.** → logo → CTAs | `SienaReveal` | Sticky 100svh stage, own scrubbed timeline |
| 4 | Solutions (Finance, Sales, Customer Service, Operations, Marketing, Data & Analytics, Automation, AI Workflows) | `Solutions` | Normal flow, light reveals |
| 5 | Build your AI system (contact CTA) + footer | `ContactCTA`, `Footer` | Normal flow |

Persistent overlays during section 2: `ScrollProgress` (era rail + live year readout, keyboard-navigable jump buttons) and a "Skip the story" link.

---

## 2 · Scroll animation architecture

**Principle: native scroll, one timeline, sticky stage.** We never hijack the wheel.

```
<section class="evo" style="height: Σ chapter.weight × 100vh">
  <div class="evo-stage" position:sticky; top:0; height:100svh>
     <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">   ← EvolutionScene
        [data-camera] → background · architecture · people · desk · objects · screens · light
        Thread (core + glow path)                                         ← shared across all eras
     </svg>
     EraLabel × 12 (real HTML, stacked, one visible at a time)
     ScrollProgress
  </div>
</section>
```

- **GSAP ScrollTrigger** maps the track's scroll progress to one **master timeline** (`scrub: 0.9` for inertia that feels like film, not lag). Sticky positioning (not `pin`) keeps the layout native and cheap.
- The timeline's duration is the sum of chapter `weight`s; each chapter gets a label, so adding/removing/re-weighting an era needs no animation code changes.
- **Generic choreography** (applied to every chapter from data): architecture/objects cross-fade with a small camera push (scale 1.04→1, y 12→0), palette CSS variables tween, copy enters/leaves, thread morphs to the chapter's shape and colour, year counter tweens.
- **Chapter extras** live in a registry (`lib/choreography.ts → extras[id]`) for bespoke moments: prologue pull-back, qalam writing, document morph, network line drawing, wall dissolve, window clutter, convergence, workflow pulse.
- Colour is animated as **CSS custom properties** on the stage (`--sky`, `--wall`, `--floor`, `--light`, `--accent`), so every layer inherits the era palette without re-rendering React.
- React renders once; GSAP owns motion after mount (`gsap.context` + `gsap.matchMedia` for cleanup and per-breakpoint timelines).
- Hidden layers are toggled with `autoAlpha` (opacity + `visibility:hidden`), so off-era art costs no paint.

---

## 3 · Component structure

```
app/
  layout.tsx            fonts (Sora + Inter via next/font, self-hosted), metadata
  page.tsx              composes sections
  globals.css           tokens, layout, modes
content/                ← ALL copy & era data (edit here, no animation code)
  site.ts               brand, nav, reveal copy, solutions, CTAs
  eras.ts               12 chapters: years, title, statement, keywords, palette, weight, thread shape, year range
lib/
  gsap.ts               plugin registration (ScrollTrigger, DrawSVG, MorphSVG — free in GSAP 3.13+)
  geometry.ts           stage constants, thread paths per era, SIENA-symbol trace
  choreography.ts       builds the master timeline from content + extras registry
  useMode.ts            "cinematic" | "chronicle" (breakpoint + prefers-reduced-motion)
components/
  Header, Hero, BrandLogo
  EvolutionTimeline     track + stage + chronicle fallback; owns ScrollTrigger
  EvolutionScene        composes all SVG layers for the stage
  HistoricalPrologue    Abbasid architecture, market, caravan, people
  DeskScene             the one desk (surface variants) + per-era desk objects
  EraLabel              year / era name / statement / keywords
  SystemNodes           department network (1990s) — reused by AI convergence
  Thread                the recurring line (core + glow)
  ScrollProgress        era rail + year readout + jump buttons
  AIConvergence         app windows → six system nodes → SIENA symbol
  FutureWorkflow        8-step intelligent flow
  SienaReveal           final statement + CTAs
  Particles             tiny canvas particle field (paused off-screen, off for reduced motion)
  Solutions, ContactCTA, Footer
  scenes/*              per-era art modules (Paper, Mechanical, Computer, Enterprise, Internet, Cloud, Automation)
```

---

## 4 · Technology stack

| Need | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + React + TypeScript**, `output: 'export'` | Static HTML for speed/SEO, deploy anywhere (Vercel, Netlify, S3/CloudFront) |
| Scroll choreography | **GSAP 3 + ScrollTrigger** | Industry standard for scrubbed, label-based timelines |
| Line drawing / morphing | **DrawSVGPlugin + MorphSVGPlugin** (bundled free with GSAP) | Signature ink-line → SIENA symbol transition |
| Styling | Plain CSS with design tokens | No runtime cost, no utility framework needed |
| Fonts | Sora (display) + Inter (text), self-hosted via `next/font` | Architectural, geometric; echoes the thin wide wordmark |
| Images | AVIF + WebP generated with `sharp` (`npm run assets`) | |
| Deliberately **not** used | Framer Motion (overlaps GSAP), Lenis (scroll hijack), Three.js/WebGL (not needed for this art direction) | Fewer deps, faster, more accessible |

Runtime JS: React + GSAP core/ScrollTrigger/DrawSVG/MorphSVG ≈ 60–70 kB gzip beyond Next's baseline.

---

## 5 · Asset plan

**Brand (source of truth: `SIENA logo.JPG`, 1254²).** Never redrawn or recoloured. Derived by crop + format conversion only:

| File | Crop | Use |
|---|---|---|
| `siena-logo.{avif,webp}` | full | Hero |
| `siena-symbol.{avif,webp}` | symbol only | AI reveal (aligned with the traced thread), header, favicon |
| `siena-lockup.{avif,webp}` | symbol + wordmark + tagline | AI chapter and final reveal |
| `siena-wordmark.{avif,webp}` | "SIENA" | Header |

The master has a baked-in near-black field. `scripts/build-brand-assets.mjs` converts that field to transparency (alpha derived from each pixel's brightness above the field level, then un-premultiplied), so the mark sits on any SIENA navy surface with no visible box; composited over black it matches the original. The mark and wordmark are not redrawn or recoloured. **Recommended:** supply a vector SVG or transparent PNG master for print-sharp edges at very large sizes, then re-run `npm run assets`.

**Scene art — layered, never one flat image per era.** Each era is built from independent layers in a shared 1600×900 coordinate space:
`sky/background → architecture → background people → desk surface → desk objects → devices → screens (live HTML/SVG UI) → light → foreground`.

- v1 (this build): hand-authored vector SVG for every layer — tiny, crisp, animatable, fully themeable by palette variables.
- v2 (optional art pass): swap selected layers for painted/photographic **AVIF cut-outs** (transparent, ≤120 kB each, 2 sizes via `srcset`) — e.g. the Abbasid market backdrop, 1920s office window, mainframe hall. Layer names and anchor positions stay the same, so the choreography does not change.
- All headlines, labels, dashboards and UI text remain live HTML/SVG text.

**Realistic rendered plates (v1.1, implemented).** Every era is now a path-traced 3D render (Blender Cycles) of the same modelled desk from the same seated camera: physically based wood, brick, brass, paper, glass and emissive screens; candle, gas, daylight, CRT and LED lighting; volumetric haze and depth of field; a film finish (bloom, gentle contrast, vignette, grain). The renderer lives in `tools/render/` and also writes each plate's trace of the recurring line (`content/plate-threads.json`), so the live line lands on the rendered ledger, typed page, CRT, spreadsheet, skyline and cloud stream. The vector illustrations remain only as a fallback.

**Photographic plates (pipeline).** Each era can use a realistic 16:9 photograph. `content/plates.ts` lists the 14 planned plates; files dropped into `art/plates/` are optimised by `npm run plates` into `public/eras/` and detected at build time. On the stage, plates sit between the vector art (skipped where a photo covers it) and the live UI layers (network lines, app windows, AI convergence, workflow, the thread, the logo). They cross-dissolve in scroll time and load progressively just ahead of the reader. In chronicle mode, the photo is pixel-aligned under the same live overlays. Prompts, the composition contract and per-plate reference frames are in `docs/PHOTO-PROMPTS.md` and `art/reference/`.

---

## 6 · Visual transition strategy per era

| Chapter | Palette (sky → accent) | Light source on the desk | Signature transition out |
|---|---|---|---|
| Prologue I · Baghdad | indigo night → gold | lanterns, candle | Camera pulls back through the pointed arch to the scribe's desk |
| Prologue II · The record | candle gold, brown | candle | Qalam writes the ink stroke (thread appears) |
| Centuries pass | gold → parchment | candle → oil lamp | Document morphs: manuscript → ledger → printed page → account book → typed page; arch masonry fades to plaster; counter 1258→1920 |
| 1920s Paper | amber, beige, dark wood | green banker's lamp | Papers slide into folders; filing cabinet recedes |
| 1950s Mechanical | muted industrial grey-brown | fluorescent | Typewriter page lifts; typewriter crossfades into terminal keyboard |
| 1970s Computer | black, grey, CRT green | CRT glow | Green scanline becomes spreadsheet line |
| 1990s Enterprise | neutral corporate blue | monitor | Department network draws: FINANCE → OPERATIONS → SALES → INVENTORY → MANAGEMENT |
| 2000s Internet | richer digital blue | LCD | Office walls dissolve into a global network sphere with trade arcs (echoing Abbasid routes) |
| 2010s Cloud & Mobile | cyan, blue, white — first hint of SIENA blue | ambient screen light | Data streams rise into cloud; devices multiply |
| 2020–25 Automation | darker digital blue | many screens | Screen clutter: 10 disconnected app windows, logins, badges — *TOO MANY SYSTEMS* |
| 2026 AI | SIENA navy + electric blue | the SIENA symbol | Windows fly into six system nodes; lines converge; thread traces the SIENA symbol; real logo resolves over it |
| 2030+ Autonomous | SIENA | SIENA | Thread unrolls into the 8-step workflow; human review points highlighted |

---

## 7 · How the recurring desk evolves

- **Camera:** first-person, seated at the desk — the visitor *is* the business. Every era's objects face the viewer, which keeps screens readable and avoids generic faces.
- **Geometry is fixed:** the desk top is the same trapezoid in the same place for all 12 chapters; only material and objects change. Anchors (centre document/device, left tool, right tool, back-left storage, back-right light) are reused so each object has a clear successor:

| Anchor | Abbasid | 1920s | 1950s | 1970s | 1990s | 2000s | 2010s | 2020–25 | 2026+ |
|---|---|---|---|---|---|---|---|---|---|
| Surface | walnut | oak | steel-edged laminate | dark laminate | grey laminate | light laminate | pale wood | dark desk | black glass, blue edge light |
| Centre | manuscript | ledger | typewriter + page | CRT terminal | PC + spreadsheet | LCD + browser | laptop | laptop + windows | SIENA symbol |
| Left | brass scales | cash book, stamp | adding machine | printout | tower PC | — | tablet | — | node: Finance/Sales |
| Right | inkwell, qalam | fountain pen | rotary phone | keyboard | mouse | phone | smartphone | notifications | node: Ops/Service |
| Coins/value | dinars & dirhams | cash | punch cards | tapes | floppy disks | card | contactless | — | data |
| Light | candle | banker's lamp | office light | CRT glow | monitor | LCD | ambient | screens | SIENA light |
| Behind | arch → caravans, market | window, filing cabinet | blinds, org chart | mainframe hall | cubicle, network | dissolving walls → globe | glass, cloud | app clutter | intelligence |

- People appear as dignified background silhouettes (merchants, clerks, typists, operators) — in 2030 the "human" is explicitly the viewer, directing and reviewing.

---

## 8 · The ink-line → SIENA transition (signature interaction)

One SVG path (`Thread`, core + blurred glow twin) lives above every era in the shared coordinate space, so it can travel continuously:

```
ink stroke (on manuscript) → ledger rule → typed line → CRT data pulse → spreadsheet trend line
→ network arc → cloud data stream → automation connector → six converging AI lines → SIENA symbol trace
→ unrolls into the autonomous workflow spine
```

1. **Birth:** in Prologue II, `DrawSVG` reveals the calligraphic stroke from 0→100% while the qalam follows the path tip (`MotionPath`-style progress mapping).
2. **Travel:** at every chapter boundary `MorphSVG` morphs the path into the next era's shape; stroke colour/width and glow opacity tween with the palette (ink brown → navy ink → black ribbon → CRT green → corporate blue → digital blue → cyan → electric blue).
3. **Convergence:** in 2026, six department lines are drawn into the centre; the thread morphs into an outline **traced from the official logo's symbol** (points sampled from the JPG, see `lib/geometry.ts`), then the fill fades up and the **real logo crop** resolves exactly on top of it. The trace is only ever a transient line — the brand mark on screen is always the original asset.
4. **Future:** the thread un-rolls into the workflow spine; a light pulse travels it as each step lights up.

---

## 9 · Desktop / tablet / mobile behaviour

| | Desktop ≥ 1200 px | Tablet 900–1199 px (landscape) | Mobile < 900 px, portrait tablet, **or** `prefers-reduced-motion` |
|---|---|---|---|
| Mode | **Cinematic** | Cinematic-lite | **Chronicle** |
| Stage | Full sticky stage, all layers, camera moves, particles | Same stage; parallax depth, particles and some background people disabled; ~25% shorter track | No sticky stage. Each chapter is its own full-bleed frame with a cropped vignette of the same desk art |
| Thread | Full morph sequence | Full morph sequence | A continuous vertical "thread" spine down the page changing colour era by era |
| Motion | Scrubbed timeline | Scrubbed timeline, fewer tweens | Gentle fade/translate on enter (none at all with reduced motion) |
| Copy | Left column over scrim | Left column, smaller type | Stacked under vignette |

Mode is decided in CSS media queries (no flash) and mirrored in `gsap.matchMedia`, so each mode builds only its own animation.

---

## 10 · Performance strategy

- Static export; HTML + CSS render the hero with zero JS; GSAP initialises after hydration.
- **All art is SVG** in v1 (≈ tens of kB); logo derivatives AVIF/WebP with `<picture>`; any future raster layers lazy-loaded and `srcset`-sized.
- Animate only `transform`, `opacity`, CSS variables and SVG path data; `autoAlpha` hides inactive eras; no layout-triggering properties in the scroll loop.
- One ScrollTrigger per sticky section (2 total) — not one per element.
- Blur/glow limited to the thread and a few light pools; no full-screen filters.
- Particles: ≤ 70 on desktop, 0 on mobile/reduced motion; `requestAnimationFrame` paused off-screen and on hidden tabs.
- Chronicle vignettes (mobile) mount only in chronicle mode; cinematic stage only in cinematic mode.
- Fonts self-hosted, subset, `display: swap`.
- Targets: LCP < 2.0 s (4G), CLS ≈ 0, ~60 fps scrub on modern laptops; Lighthouse ≥ 90 performance / 100 accessibility.

---

## Accessibility checklist

Semantic landmarks (`header`, `main`, `section`, `nav`, `footer`); all copy is HTML; decorative SVG `aria-hidden`; logo images have alt text; era rail is a `nav` of buttons with `aria-current`; visible focus rings; "Skip the story" link; WCAG AA contrast on every palette (copy sits on a scrim); `prefers-reduced-motion` → static chronicle.
