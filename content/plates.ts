/**
 * PHOTOGRAPHIC PLATES — realistic imagery for each era.
 *
 * Drop your photos into `art/plates/` named `<id>.jpg|png|webp` and run `npm run plates`.
 * Optimised files are written to `public/eras/` and the site picks them up automatically at build time.
 * Any plate that doesn't exist yet falls back to the vector illustration, so you can add them one by one.
 *
 * Composition contract (see docs/PHOTO-PROMPTS.md and art/reference/): every plate is 16:9 and shares
 * one first-person camera. The site maps a plate onto stage space x −160…1760, y −90…990, so the desk
 * centre (stage x 960) sits at 58.3% of the image width.
 */

export type Plate = {
  id: string;
  /** chapter this plate belongs to (content/eras.ts id) */
  era: string;
  /** when the plate becomes visible, as a fraction of its chapter (0 = at the chapter boundary) */
  at: number;
  /** cross-dissolve length in chapter-weight units (default 0.35) */
  dissolve?: number;
  /** long edge the optimiser outputs (the prologue needs more pixels because the camera starts zoomed in) */
  width?: number;
  /** object-position used when the plate is cropped for mobile */
  focus?: string;
  alt: string;
};

export const PLATES: Plate[] = [
  { id: "abbasid", era: "abbasid", at: 0, width: 3840, focus: "60% 60%", alt: "A scribe’s desk in an Abbasid-era hall at dusk; through a pointed arch, a Baghdad market and a caravan on the horizon." },
  { id: "record", era: "record", at: 0.12, width: 3840, focus: "58% 75%", alt: "A reed pen completes a line of ink on a paper manuscript beside brass scales, dinars and dirhams, lit by a candle." },
  { id: "centuries-ledger", era: "centuries", at: 0.08, dissolve: 0.3, focus: "58% 72%", alt: "The same desk centuries later: a bound ledger lit by candlelight in a plastered room." },
  { id: "centuries-printed", era: "centuries", at: 0.36, dissolve: 0.3, focus: "58% 72%", alt: "An eighteenth-century merchant’s desk with a printed document and an oil lamp." },
  { id: "centuries-accountbook", era: "centuries", at: 0.64, dissolve: 0.3, focus: "58% 72%", alt: "A nineteenth-century counting-house desk with an open account book and a gas lamp." },
  { id: "paper", era: "paper", at: 0, focus: "58% 70%", alt: "A 1920s accounts office: open ledger, banker’s lamp, folders, filing cabinets and a frosted-glass door." },
  { id: "mechanical", era: "mechanical", at: 0, focus: "58% 68%", alt: "A 1950s office desk with a typewriter, rotary telephone, adding machine and punch cards." },
  { id: "computer", era: "computer", at: 0, focus: "58% 55%", alt: "A 1970s computer room: a CRT terminal glowing green in front of mainframe tape drives." },
  { id: "enterprise", era: "enterprise", at: 0, focus: "58% 55%", alt: "A 1990s corporate desk with a beige desktop PC showing a spreadsheet, keyboard, mouse and floppy disks." },
  { id: "internet", era: "internet", at: 0, focus: "58% 55%", alt: "A 2000s office at night with a flat LCD monitor showing an online store and a city beyond the glass." },
  { id: "cloud", era: "cloud", at: 0, focus: "58% 60%", alt: "A 2010s workspace with a laptop, tablet and smartphone showing cloud dashboards." },
  { id: "automation", era: "automation", at: 0, focus: "58% 60%", alt: "A modern desk crowded with screens and a laptop, lit blue in a dark office." },
  { id: "ai", era: "ai", at: 0, focus: "58% 50%", alt: "A dark, minimal room with a black glass desk edged in electric-blue light." },
  { id: "autonomous", era: "autonomous", at: 0, focus: "58% 50%", alt: "A calm, near-dark executive space; a person reviews a glowing glass display at the same desk." },
];

/** Stage-space rectangle every plate is drawn into (16:9 with overscan so the camera can move). */
export const PLATE_RECT = { x: -160, y: -90, w: 1920, h: 1080 } as const;
