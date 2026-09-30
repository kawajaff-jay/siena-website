import type { ThreadKey } from "@/lib/geometry";

/**
 * THE EVOLUTION — editable content.
 * Every chapter of the sticky stage is defined here. Animation code reads this data;
 * you can re-word, re-weight or re-colour an era without touching choreography.
 */

export type Palette = {
  /** top of the room / sky */
  sky: string;
  /** lower wall */
  wall: string;
  /** desk surface */
  desk: string;
  /** desk front edge / shadow */
  deskEdge: string;
  /** dominant light source colour */
  light: string;
  /** accent for labels, keywords, the thread */
  accent: string;
};

export type Era = {
  id: string;
  /** Display years, e.g. "1920s–1940s" */
  years: string;
  /** Short name used in the progress rail */
  railLabel: string;
  /** Era name (eyebrow) */
  title: string;
  /** The one powerful sentence (main message). Use \n for deliberate line breaks. */
  statement: string;
  /** Optional supporting line */
  lead?: string;
  /** 3–7 keywords */
  keywords: string[];
  /** Relative scroll length (1 = one viewport height) */
  weight: number;
  /** Year counter range while this chapter plays */
  yearFrom: number;
  yearTo: number;
  /** Optional year keyframes as [fraction of the chapter, year]; equal neighbours hold the year */
  /** Optional per-beat reveal times (fraction of the chapter); default 0.5, 0.65, … */
  beatAt?: number[];
  yearKeys?: [number, number][];
  palette: Palette;
  /** Shape of the recurring line in this chapter */
  thread: ThreadKey;
  /** Thread stroke colour & glow (0–1) */
  threadColor: string;
  threadGlow: number;
  /** Copy placement on the cinematic stage */
  copy?: "left" | "bottom";
  /** Extra beats (secondary headlines shown in sequence) */
  beats?: string[];
};

export const ERAS: Era[] = [
  {
    id: "abbasid",
    years: "c. 750–1258 CE",
    railLabel: "Baghdad",
    title: "The Foundations of Organized Commerce",
    statement: "Before software, business ran on people, paper, trust and records.",
    keywords: ["Trade", "Accounting", "Contracts", "Treasury", "Inventory", "Administration", "Communication"],
    weight: 1.7,
    yearFrom: 762,
    yearTo: 850,
    palette: { sky: "#0c1024", wall: "#241609", desk: "#3b2413", deskEdge: "#1c1008", light: "#ffb54d", accent: "#dcab55" },
    thread: "ink",
    threadColor: "#2b170a",
    threadGlow: 0,
  },
  {
    id: "record",
    years: "Baghdad · c. 850 CE",
    railLabel: "The record",
    title: "The Scribe’s Account",
    statement: "Every sale, weight and coin — written down.",
    lead: "Merchants traded on trust. Scribes made that trust verifiable.",
    keywords: ["Dinars & dirhams", "Scales", "Contracts", "Ledgers"],
    weight: 1.2,
    yearFrom: 850,
    yearTo: 1000,
    palette: { sky: "#150d06", wall: "#2a190c", desk: "#4a2c15", deskEdge: "#1e1108", light: "#ffae45", accent: "#e3b45f" },
    thread: "ink",
    threadColor: "#2b170a",
    threadGlow: 0,
  },
  {
    id: "centuries",
    years: "1258 → 1919",
    railLabel: "Centuries",
    title: "Centuries Pass",
    statement: "For centuries, business depended on records, people and process.",
    beats: ["The industrial age changed the speed of business."],
    keywords: ["Manuscript", "Ledger", "Printed page", "Account book"],
    weight: 2.2,
    yearFrom: 1258,
    yearTo: 1919,
    // centuries visibly pass: 1258 → 1300 → 1340 → 1370 → c. 1400 (ledger), a hold, then the printed age
    yearKeys: [[0, 1258], [0.1, 1300], [0.2, 1340], [0.29, 1370], [0.38, 1400], [0.58, 1400], [0.7, 1750], [0.76, 1800], [0.88, 1890], [1, 1919]],
    // the industrial-age line arrives around 1790–1800
    beatAt: [0.75],
    palette: { sky: "#1c140b", wall: "#3a2917", desk: "#4f341c", deskEdge: "#20150b", light: "#f4c27c", accent: "#d9b37b" },
    thread: "ledger",
    threadColor: "#1f2233",
    threadGlow: 0,
  },
  {
    id: "paper",
    years: "1920s–1940s",
    railLabel: "Paper",
    title: "The Paper System",
    statement: "Business was built on paper.",
    keywords: ["Manual records", "Bookkeeping", "Cash transactions", "Filing systems", "Human administration"],
    weight: 1.1,
    yearFrom: 1920,
    yearTo: 1949,
    palette: { sky: "#261c12", wall: "#4a3623", desk: "#5b3d21", deskEdge: "#24180c", light: "#ffd08a", accent: "#e6bb78" },
    thread: "ledger",
    threadColor: "#1e2438",
    threadGlow: 0,
  },
  {
    id: "mechanical",
    years: "1950s–1960s",
    railLabel: "Mechanical",
    title: "The Mechanical Office",
    statement: "Machines accelerated the office.",
    keywords: ["Typewriters", "Rotary telephones", "Adding machines", "Punch cards", "Departments"],
    weight: 1.1,
    yearFrom: 1950,
    yearTo: 1969,
    palette: { sky: "#232426", wall: "#46443f", desk: "#4d463e", deskEdge: "#1f1c19", light: "#efe5cf", accent: "#cfc3ad" },
    thread: "typed",
    threadColor: "#121212",
    threadGlow: 0,
  },
  {
    id: "computer",
    years: "1970s–1980s",
    railLabel: "Computer",
    title: "The Computer Revolution",
    statement: "Information became digital.",
    keywords: ["Mainframes", "CRT terminals", "Electronic payroll", "Databases", "Computerized inventory"],
    weight: 1.5,
    yearFrom: 1970,
    yearTo: 1989,
    palette: { sky: "#060808", wall: "#131718", desk: "#1d2121", deskEdge: "#0a0c0c", light: "#3dff8e", accent: "#62f5a0" },
    thread: "data",
    threadColor: "#46ff97",
    threadGlow: 0.6,
  },
  {
    id: "enterprise",
    years: "1990s",
    railLabel: "Enterprise",
    title: "The Enterprise Revolution",
    statement: "Departments became connected.",
    keywords: ["Desktop PCs", "Spreadsheets", "Email", "ERP systems", "Local networks"],
    weight: 1.25,
    yearFrom: 1990,
    yearTo: 1999,
    palette: { sky: "#0c1522", wall: "#1b2a3c", desk: "#2a3544", deskEdge: "#10161f", light: "#a9c6f2", accent: "#8cb0e8" },
    thread: "sheet",
    threadColor: "#3b78d8",
    threadGlow: 0.25,
  },
  {
    id: "internet",
    years: "2000s",
    railLabel: "Internet",
    title: "The Internet Revolution",
    statement: "Business became global.",
    keywords: ["Websites", "E-commerce", "Online banking", "CRM", "Digital marketing", "Global supply chains"],
    weight: 1.6,
    yearFrom: 2000,
    yearTo: 2009,
    palette: { sky: "#05112c", wall: "#0c2149", desk: "#1a2b4c", deskEdge: "#0a1224", light: "#5b95ff", accent: "#6aa4ff" },
    thread: "network",
    threadColor: "#5a9bff",
    threadGlow: 0.5,
  },
  {
    id: "cloud",
    years: "2010s",
    railLabel: "Cloud",
    title: "The Cloud & Mobile Revolution",
    statement: "Business became connected everywhere.",
    keywords: ["Smartphones", "SaaS", "Cloud storage", "APIs", "Real-time analytics"],
    weight: 1.1,
    yearFrom: 2010,
    yearTo: 2019,
    palette: { sky: "#051a2b", wall: "#0b2f47", desk: "#172c3e", deskEdge: "#08131d", light: "#95ecff", accent: "#7fe3ff" },
    thread: "stream",
    threadColor: "#7fe3ff",
    threadGlow: 0.6,
  },
  {
    id: "automation",
    years: "2020–2025",
    railLabel: "Automation",
    title: "The Automation Revolution",
    statement: "Software automated tasks.",
    lead: "Automation improved work — but business systems stayed fragmented.",
    beats: ["Too many systems."],
    keywords: ["Workflow automation", "CRM automation", "Chatbots", "Integrations", "Dashboards"],
    weight: 1.35,
    yearFrom: 2020,
    yearTo: 2025,
    palette: { sky: "#040a1a", wall: "#09142d", desk: "#0e182c", deskEdge: "#050a14", light: "#4273ff", accent: "#6e8fff" },
    thread: "workflow",
    threadColor: "#3f73ff",
    threadGlow: 0.55,
  },
  {
    id: "ai",
    years: "2026",
    railLabel: "AI",
    title: "The AI Revolution",
    statement: "Software followed instructions.",
    beats: ["Intelligent systems understand the business."],
    keywords: ["Finance", "Sales", "Customer Service", "Operations", "Marketing", "Data & Analytics"],
    weight: 2.5,
    yearFrom: 2026,
    yearTo: 2026,
    palette: { sky: "#02040a", wall: "#050a17", desk: "#060c1a", deskEdge: "#02050c", light: "#1f6bff", accent: "#2f7bff" },
    thread: "siena",
    threadColor: "#3a86ff",
    threadGlow: 1,
    copy: "bottom",
  },
  {
    id: "autonomous",
    years: "2030 and beyond",
    railLabel: "Autonomous",
    title: "The Autonomous Business",
    statement: "The business becomes intelligent.",
    lead: "People set direction and review. Intelligent systems carry the flow.",
    keywords: [
      "AI agents",
      "Autonomous workflows",
      "Predictive operations",
      "Intelligent finance",
      "Intelligent CRM",
      "Real-time decision support",
      "Human + AI collaboration",
    ],
    weight: 1.9,
    yearFrom: 2030,
    yearTo: 2035,
    palette: { sky: "#02040a", wall: "#040915", desk: "#060c1a", deskEdge: "#02050c", light: "#2a74ff", accent: "#4a8dff" },
    thread: "flow",
    threadColor: "#3a86ff",
    threadGlow: 0.9,
  },
];

/** The eight-step intelligent workflow (2030+) */
export const WORKFLOW_STEPS = [
  "Customer request",
  "AI understands",
  "CRM updates",
  "Inventory checks",
  "Order processes",
  "Invoice generates",
  "Payment tracks",
  "Management receives insight",
];

/** Labels for the six converging systems (order matches AI_NODES in lib/geometry.ts) */
export const AI_SYSTEMS = ["Finance", "Sales", "Customer Service", "Operations", "Marketing", "Data & Analytics"];

/** App windows that clutter the 2020–25 desk before converging (order maps onto AI_SYSTEMS by index % 6) */
export const APP_WINDOWS = [
  "Invoices", "CRM", "Helpdesk", "Inventory", "Ads Manager", "Analytics",
  "Payroll", "Email", "Live chat", "Spreadsheets",
];

export const totalWeight = ERAS.reduce((s, e) => s + e.weight, 0);
