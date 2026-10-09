# SIENA — The Evolution of Business Systems

Official homepage for **SIENA — AI Solutions & Systems**.
*One desk. One business. Centuries of evolution.*

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → ./out  (deploy the folder to any CDN / Vercel / Netlify)
```

Requires Node 20+.

## Homepage

The homepage (`app/page.tsx`) is **Genesis Flux**: scrolling builds the SIENA symbol from a live particle network (move the cursor to disturb it, click to send a pulse), then the six solution modules orbit the official logo; selecting one runs its workflow.

| Part | File |
|---|---|
| Hero engine (particles, logo, orbiting modules) | `components/genesis/Genesis.tsx` |
| Solutions wheel (`#solution-<id>` opens a solution) | `components/flux/SolutionsTide.tsx` |
| Header (section tracking, mobile menu), header logo with pink tail | `components/flux/FluxHeader.tsx`, `TailSymbol.tsx` |
| About SIENA, then the Light Sweep logo interlude; Why SIENA (Without/With switch) | `components/flux/FluxWhat.tsx`, `LogoInterlude.tsx`, `FluxWhy.tsx` |
| Contact form (opens a pre-filled email), footer | `components/flux/FluxContact.tsx`, `FluxFooter.tsx` |
| Colours, fonts, layout | `app/home.module.css` |

All copy comes from `content/site.ts`.

The previous homepage, with the full-screen Evolution story, is kept at `/preview/classic` (`/story` links there). Design explorations live under `/preview`; the logo interludes under `/preview-logo`.

**To do:** use the **Logo Reveal** interlude (`<LogoInterlude variant="lockup" />`, preview `/preview-logo/lockup`) in the end section of the website.

## Where to edit

| What | File |
|---|---|
| Era copy, years, keywords, palettes, scroll length, thread colour | `content/eras.ts` |
| Hero, reveal lines, CTAs, solutions, contact email, domain | `content/site.ts` |
| Realistic era images (3D renders; replaceable by photos) | `art/plates/<id>.jpg` → `npm run plates` · list in `content/plates.ts` · renderer in `tools/render/` · photo prompts in `docs/PHOTO-PROMPTS.md` |
| Scene art for each era (layered SVG, used where no photo exists) | `components/scenes/*` |
| Which layers show in which era | `LAYERS` in `components/EvolutionScene.tsx` |
| Scroll choreography (generic rules + per-chapter extras) | `lib/choreography.ts` |
| The thread shapes and SIENA symbol trace | `lib/geometry.ts` |
| Design tokens and layout | `app/globals.css` |

**Before launch:** set `SITE.url` and `SITE.contactEmail` in `content/site.ts` (placeholders are `example.com`).

## Brand assets

`brand/SIENA logo.JPG` is the single source of truth. `npm run assets` crops it, turns its dark background into transparency and writes AVIF/WebP files to `public/brand/`. The mark and wordmark are never redrawn. If you get a vector or transparent master, replace the file and run the script again.

## Modes

- **Cinematic** (≥ 900 px wide, motion allowed): a sticky stage with one scroll-scrubbed GSAP timeline.
- **Chronicle** (mobile, portrait tablet, `prefers-reduced-motion`, or no JavaScript): the same eras as a linear story with static vignettes.

See `docs/ARCHITECTURE.md` for the full architecture.
