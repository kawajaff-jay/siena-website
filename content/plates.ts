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
  /** "top-down": the new plate is revealed through a soft band moving down the frame, so the room
   *  changes first and the desk objects last (the previous plate's desk stays visible a little longer) */
  reveal?: "top-down";
  /** long edge the optimiser outputs (the prologue needs more pixels because the camera starts zoomed in) */
  width?: number;
  /** object-position used when the plate is cropped for mobile */
  focus?: string;
  alt: string;
};

export const PLATES: Plate[] = [
  { id: "abbasid", era: "abbasid", at: 0, width: 3840, focus: "60% 60%", alt: "A scribe’s desk in an Abbasid-era hall at dusk; through a pointed arch, a Baghdad market and a caravan on the horizon." },
  { id: "record", era: "record", at: 0.12, width: 3840, focus: "58% 75%", alt: "A reed pen completes a line of ink on a paper manuscript beside brass scales, dinars and dirhams, lit by a candle." },
  { id: "centuries-ledger", era: "centuries", at: 0.22, dissolve: 0.7, reveal: "top-down", focus: "58% 72%", alt: "The same desk centuries later: a bound ledger lit by candlelight in a plastered room." },
  { id: "centuries-printed", era: "centuries", at: 0.68, dissolve: 0.3, focus: "58% 72%", alt: "An eighteenth-century merchant’s desk with a printed document and an oil lamp." },
  { id: "centuries-accountbook", era: "centuries", at: 0.87, dissolve: 0.35, focus: "58% 72%", alt: "An 1890s counting office: printed account books, invoices and receipts, a steel-nib pen and inkstand, filing shelves and a gas lamp." },
  { id: "paper", era: "paper", at: 0, focus: "58% 70%", alt: "A 1920s accounts office: open ledger, banker’s lamp, folders, filing cabinets and a frosted-glass door." },
  { id: "mechanical", era: "mechanical", at: 0, focus: "58% 68%", alt: "A 1950s office desk with a typewriter, rotary telephone, adding machine and punch cards." },
  { id: "computer", era: "computer", at: 0, focus: "58% 55%", alt: "An early-1970s office beside the machine room: a bulky green-text terminal, punched cards and continuous-feed printout in front of mainframe tape drives." },
  // the same desk as computing moves from the mainframe toward the personal computer (shown only once the files exist)
  { id: "computer-1979", era: "computer", at: 0.4, dissolve: 0.3, focus: "58% 55%", alt: "The same desk around 1979: a cleaner CRT terminal with more controls, less paper, more of the records on screen." },
  { id: "computer-1985", era: "computer", at: 0.72, dissolve: 0.3, focus: "58% 55%", alt: "The same desk around 1985: an early business personal computer with a detached keyboard, floppy drives and a spreadsheet on screen." },
  { id: "enterprise", era: "enterprise", at: 0, dissolve: 0.45, focus: "58% 55%", alt: "A 1990s corporate desk with a beige desktop PC showing a spreadsheet, keyboard, mouse and floppy disks." },
  { id: "internet", era: "internet", at: 0, focus: "58% 55%", alt: "An office at night around 2000: a CRT monitor and desktop tower with an early web browser and email, network cables, paper still on the desk, a city beyond the glass." },
  // the same desk as the internet becomes everyday business (shown only once the files exist)
  { id: "internet-2003", era: "internet", at: 0.3, dissolve: 0.25, focus: "58% 55%", alt: "The same desk around 2003: a first flat monitor, a laptop, email and web-based business, early online banking, less paper." },
  { id: "internet-2005", era: "internet", at: 0.52, dissolve: 0.25, focus: "58% 55%", alt: "The same desk around 2005: an e-commerce site, online banking and a customer database on screen, a PDA beside the keyboard." },
  { id: "internet-2007", era: "internet", at: 0.74, dissolve: 0.25, focus: "58% 55%", alt: "The same desk around 2007: a slim LCD, laptop and early smartphone, online payments and global connections." },
  // the same desk through the 2010s (shown only once the files exist)
  { id: "cloud-2014", era: "cloud", at: 0.4, dissolve: 0.25, focus: "58% 60%", alt: "The same desk around 2014: laptop, smartphone and tablet in sync, SaaS dashboards, a video call with remote colleagues." },
  { id: "cloud-2017", era: "cloud", at: 0.72, dissolve: 0.25, focus: "58% 60%", alt: "The same desk around 2017: a large monitor with real-time analytics, laptop, tablet and phone all synced to the cloud." },
  { id: "cloud", era: "cloud", at: 0, dissolve: 0.45, focus: "58% 60%", alt: "A 2010s workspace with a laptop, tablet and smartphone showing cloud dashboards." },
  { id: "automation", era: "automation", at: 0, focus: "58% 60%", alt: "A modern desk crowded with screens and a laptop, lit blue in a dark office." },
  { id: "ai", era: "ai", at: 0, focus: "58% 50%", alt: "A dark, minimal room with a black glass desk edged in electric-blue light." },
  { id: "autonomous", era: "autonomous", at: 0, focus: "58% 50%", alt: "A calm, near-dark executive space; a person reviews a glowing glass display at the same desk." },
];

/** Stage-space rectangle every plate is drawn into (16:9 with overscan so the camera can move). */
export const PLATE_RECT = { x: -160, y: -90, w: 1920, h: 1080 } as const;
