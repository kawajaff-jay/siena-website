/**
 * EvolutionScene — composes every layer of the one desk in one SVG coordinate space.
 * The same layer registry renders (a) the cinematic sticky stage and (b) static per-era vignettes
 * for the chronicle (mobile / reduced-motion) mode.
 */
import type { CSSProperties, ReactNode } from "react";
import { ERAS, type Era } from "@/content/eras";
import { STAGE } from "@/lib/geometry";
import { DeskGlass, DeskLaminate, DeskSurface, DeskWood, PaletteDefs, Room } from "./scenes/common";
import { AbbasidBackground, AbbasidObjects, Qalam } from "./scenes/AbbasidArt";
import { AccountBook, Ledger, Manuscript, PrintedPage } from "./scenes/DocumentStates";
import { PaperBackground, PaperObjects } from "./scenes/PaperArt";
import { ComputerBackground, ComputerObjects, MechanicalBackground, MechanicalObjects } from "./scenes/MachineArt";
import {
  AutomationBackground, AutomationObjects, AutomationWindows, CloudBackground, CloudObjects,
  EnterpriseBackground, EnterpriseObjects, InternetBackground, InternetGlobe, InternetObjects,
} from "./scenes/DigitalArt";
import { PLATE_RECT } from "@/content/plates";
import type { AvailablePlate } from "@/lib/plates.server";
import { SystemNodes } from "./SystemNodes";
import { AIConvergence, AIConvergenceBackground } from "./AIConvergence";
import { FutureWorkflow } from "./FutureWorkflow";
import { Thread } from "./Thread";

type EraId = (typeof ERAS)[number]["id"];

type Layer = {
  key: string;
  /** first chapter the layer is visible in */
  from: EraId;
  /** last chapter the layer is visible in */
  to: EraId;
  /** "slow" = dissolve across the whole chapter instead of a quick cross-fade at the boundary */
  fadeIn?: "slow";
  fadeOut?: "slow";
  /** timing owned by chapter extras (choreography.ts) instead of the generic rules */
  custom?: boolean;
  /** "ui" layers are live overlays (network lines, app windows, AI convergence…) drawn above photographic plates */
  kind?: "ui";
  /** chapters whose static vignette should include this layer (defaults to from..to) */
  vignette?: EraId[];
  node: ReactNode;
};

/** Z-ordered registry. Earlier = further back. */
export const LAYERS: Layer[] = [
  // architecture & backgrounds
  { key: "bg-internet", from: "internet", to: "internet", node: <InternetBackground /> },
  { key: "bg-abbasid", from: "abbasid", to: "centuries", fadeOut: "slow", node: <AbbasidBackground /> },
  { key: "bg-paper", from: "centuries", to: "paper", fadeIn: "slow", vignette: ["paper"], node: <PaperBackground /> },
  { key: "bg-mechanical", from: "mechanical", to: "mechanical", node: <MechanicalBackground /> },
  { key: "bg-computer", from: "computer", to: "computer", node: <ComputerBackground /> },
  { key: "bg-enterprise", from: "enterprise", to: "internet", fadeOut: "slow", vignette: ["enterprise"], node: <EnterpriseBackground /> },
  { key: "net-departments", from: "enterprise", to: "enterprise", custom: true, kind: "ui", vignette: ["enterprise"], node: <SystemNodes /> },
  { key: "net-globe", from: "internet", to: "internet", kind: "ui", node: <InternetGlobe /> },
  { key: "bg-cloud", from: "cloud", to: "cloud", node: <CloudBackground /> },
  { key: "bg-automation", from: "automation", to: "automation", node: <AutomationBackground /> },
  { key: "bg-ai", from: "ai", to: "autonomous", node: <AIConvergenceBackground /> },
  // the desk: one geometry, evolving materials
  { key: "desk", from: "abbasid", to: "autonomous", node: <DeskSurface /> },
  { key: "desk-wood", from: "abbasid", to: "paper", node: <DeskWood /> },
  { key: "desk-laminate", from: "mechanical", to: "cloud", node: <DeskLaminate /> },
  { key: "desk-glass", from: "automation", to: "autonomous", fadeIn: "slow", vignette: ["ai", "autonomous"], node: <DeskGlass /> },
  // desk objects
  { key: "obj-abbasid", from: "abbasid", to: "centuries", fadeOut: "slow", vignette: ["abbasid", "record"], node: <AbbasidObjects /> },
  { key: "doc-manuscript", from: "abbasid", to: "record", custom: true, vignette: ["abbasid", "record"], node: <Manuscript /> },
  { key: "doc-ledger", from: "centuries", to: "centuries", custom: true, vignette: ["centuries"], node: <Ledger /> },
  { key: "doc-printed", from: "centuries", to: "centuries", custom: true, vignette: [], node: <PrintedPage /> },
  { key: "doc-accountbook", from: "paper", to: "paper", custom: true, vignette: ["paper"], node: <AccountBook /> },
  { key: "obj-paper", from: "paper", to: "paper", node: <PaperObjects /> },
  { key: "obj-mechanical", from: "mechanical", to: "mechanical", node: <MechanicalObjects /> },
  { key: "obj-computer", from: "computer", to: "computer", node: <ComputerObjects /> },
  { key: "obj-enterprise", from: "enterprise", to: "enterprise", node: <EnterpriseObjects /> },
  { key: "obj-internet", from: "internet", to: "internet", node: <InternetObjects /> },
  { key: "obj-cloud", from: "cloud", to: "cloud", node: <CloudObjects /> },
  { key: "obj-automation", from: "automation", to: "automation", node: <AutomationObjects /> },
  { key: "win-automation", from: "automation", to: "ai", custom: true, kind: "ui", vignette: ["automation"], node: <AutomationWindows /> },
  { key: "ai", from: "ai", to: "ai", custom: true, kind: "ui", vignette: ["ai"], node: <AIConvergence /> },
  { key: "flow", from: "autonomous", to: "autonomous", custom: true, kind: "ui", vignette: ["autonomous"], node: <FutureWorkflow /> },
  { key: "qalam", from: "abbasid", to: "record", custom: true, vignette: [], node: <Qalam /> },
];

const eraIndex = (id: string) => ERAS.findIndex((e) => e.id === id);

export function paletteStyle(e: Era): CSSProperties {
  const p = e.palette;
  return {
    "--sky": p.sky, "--wall": p.wall, "--desk": p.desk, "--desk-edge": p.deskEdge, "--light": p.light, "--accent": p.accent,
  } as CSSProperties;
}

/** True when every chapter an art layer spans is covered by a photographic plate (so the vector art can be skipped). */
function coveredByPlates(l: Layer, plates: AvailablePlate[]) {
  if (l.kind === "ui" || !plates.length) return false;
  const eras = new Set(plates.map((p) => p.era));
  for (let i = eraIndex(l.from); i <= eraIndex(l.to); i++) if (!eras.has(ERAS[i].id)) return false;
  return true;
}

function renderLayer(l: Layer) {
  return (
    <g key={l.key} data-layer={l.key} data-from={l.from} data-to={l.to} data-fade-in={l.fadeIn} data-fade-out={l.fadeOut} data-custom={l.custom ? "" : undefined}>
      {l.node}
    </g>
  );
}

/** The cinematic stage: every layer, all eras, one camera. Photographic plates sit between the art and the live UI. */
export function EvolutionStageScene({ plates = [] }: { plates?: AvailablePlate[] }) {
  const art = LAYERS.filter((l) => l.kind !== "ui" && !coveredByPlates(l, plates));
  const ui = LAYERS.filter((l) => l.kind === "ui");
  return (
    <svg className="scene" viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <PaletteDefs />
      <g data-camera>
        <Room />
        {art.map(renderLayer)}
        <g data-plates>
          {plates.map((p) => (
            <g key={p.id} data-plate={p.id} data-era={p.era} data-at={p.at} data-dissolve={p.dissolve ?? 0.35} data-thread-d={p.thread} data-reveal={p.reveal}>
              {p.reveal && (
                <defs>
                  <linearGradient id={`reveal-g-${p.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop data-reveal-a offset="0" stopColor="#fff" />
                    <stop data-reveal-b offset="0" stopColor="#000" />
                  </linearGradient>
                  <mask id={`reveal-m-${p.id}`} maskUnits="userSpaceOnUse" x={PLATE_RECT.x} y={PLATE_RECT.y} width={PLATE_RECT.w} height={PLATE_RECT.h}>
                    <rect x={PLATE_RECT.x} y={PLATE_RECT.y} width={PLATE_RECT.w} height={PLATE_RECT.h} fill={`url(#reveal-g-${p.id})`} />
                  </mask>
                </defs>
              )}
              {/* href is assigned just before the plate is needed (see choreography), so photos load progressively */}
              <image data-src={p.src} x={PLATE_RECT.x} y={PLATE_RECT.y} width={PLATE_RECT.w} height={PLATE_RECT.h} preserveAspectRatio="xMidYMid slice" mask={p.reveal ? `url(#reveal-m-${p.id})` : undefined} />
            </g>
          ))}
        </g>
        {ui.map(renderLayer)}
        <Thread shape={ERAS[0].thread} color={ERAS[0].threadColor} glow={0} />
      </g>
      <rect x="-200" y="-100" width="2000" height="1100" fill="url(#g-vignette)" pointerEvents="none" />
    </svg>
  );
}

/** A static vignette of one era (chronicle mode). Same art, cropped around the desk — or the era's photo with live overlays. */
export function EraVignette({ era, plate }: { era: Era; plate?: AvailablePlate }) {
  const i = eraIndex(era.id);
  const layers = LAYERS.filter((l) => {
    if (plate && l.kind !== "ui") return false;
    if (l.vignette) return l.vignette.includes(era.id);
    return eraIndex(l.from) <= i && i <= eraIndex(l.to) && !(l.fadeIn === "slow" && l.from === era.id);
  });
  const gid = `-${era.id}`;
  const svg = (
    <svg className="vignette" viewBox={`${VIGNETTE.x} ${VIGNETTE.y} ${VIGNETTE.w} ${VIGNETTE.h}`} preserveAspectRatio="xMidYMid slice" style={paletteStyle(era)} aria-hidden="true" focusable="false">
      <PaletteDefs gid={gid} />
      {!plate && <Room gid={gid} />}
      {layers.map((l) => (
        <g key={l.key}>{l.key === "desk" ? <DeskSurface gid={gid} /> : l.node}</g>
      ))}
      {era.id !== "abbasid" && <Thread shape={era.thread} d={plate?.thread} color={plate ? era.palette.accent : era.threadColor} glow={Math.max(era.threadGlow, plate ? 0.4 : 0) * 0.5} />}
      {!plate && <rect x="-200" y="-100" width="2000" height="1100" fill="url(#g-vignette)" />}
    </svg>
  );
  if (!plate) return svg;
  // Position the photo so it lines up exactly with the vignette's viewBox.
  const style: CSSProperties = {
    width: `${(PLATE_RECT.w / VIGNETTE.w) * 100}%`,
    left: `${((PLATE_RECT.x - VIGNETTE.x) / VIGNETTE.w) * 100}%`,
    top: `${((PLATE_RECT.y - VIGNETTE.y) / VIGNETTE.h) * 100}%`,
  };
  const base = plate.small.replace(/\.(webp|jpg)$/, "");
  return (
    <>
      <picture className="vignette-photo" style={style}>
        {plate.avif && <source type="image/avif" srcSet={`${base}.avif`} />}
        <img src={plate.small} alt={plate.alt} loading="lazy" decoding="async" width={1280} height={720} />
      </picture>
      {svg}
    </>
  );
}

/** Crop of stage space used for chronicle vignettes (3:2). */
const VIGNETTE = { x: 420, y: 60, w: 1140, h: 760 } as const;
