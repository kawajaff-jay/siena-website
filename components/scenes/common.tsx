/**
 * Shared scene primitives. All scene art lives in one 1600×900 coordinate space (lib/geometry STAGE).
 * Colours that evolve per era come from CSS custom properties (see .scene rules in globals.css):
 *   --sky --wall --desk --desk-edge --light --accent
 */
import type { ReactNode } from "react";

/** Palette-driven gradients. Must live INSIDE each SVG so they inherit that SVG's CSS variables. */
export function PaletteDefs({ gid = "" }: { gid?: string }) {
  return (
    <defs>
      <linearGradient id={`g-room${gid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className="stop-sky" />
        <stop offset="1" className="stop-wall" />
      </linearGradient>
      <linearGradient id={`g-desk${gid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className="stop-desk" />
        <stop offset="1" className="stop-desk-edge" />
      </linearGradient>
    </defs>
  );
}

/** Palette-independent defs, rendered once per page in a zero-size (but rendered) SVG. */
export function SceneDefs() {
  const p = (n: string) => n;
  return (
    <defs>
      <radialGradient id="g-white" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff6e0" stopOpacity="0.45" />
        <stop offset="1" stopColor="#fff6e0" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g-cyan" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#9befff" stopOpacity="0.4" />
        <stop offset="1" stopColor="#5fd8ff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={p("g-warm")} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffd38a" stopOpacity="0.9" />
        <stop offset="0.35" stopColor="#ffab3d" stopOpacity="0.28" />
        <stop offset="1" stopColor="#ff9a2e" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={p("g-blue")} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#4d8dff" stopOpacity="0.75" />
        <stop offset="0.4" stopColor="#1f5fff" stopOpacity="0.22" />
        <stop offset="1" stopColor="#0a2a8a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={p("g-green")} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#57ff9f" stopOpacity="0.5" />
        <stop offset="1" stopColor="#1aff6e" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={p("g-vignette")} cx="0.5" cy="0.45" r="0.75">
        <stop offset="0.55" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.75" />
      </radialGradient>
      <linearGradient id={p("g-paper")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#efe0bf" />
        <stop offset="1" stopColor="#cdb487" />
      </linearGradient>
      <linearGradient id={p("g-paper-white")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6f1e6" />
        <stop offset="1" stopColor="#d9d2c2" />
      </linearGradient>
      <linearGradient id={p("g-brass")} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f1cf7a" />
        <stop offset="0.5" stopColor="#b98a3a" />
        <stop offset="1" stopColor="#6e4c1c" />
      </linearGradient>
      <linearGradient id={p("g-dusk")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0d1231" />
        <stop offset="0.55" stopColor="#3b2a4a" />
        <stop offset="0.85" stopColor="#c0703a" />
        <stop offset="1" stopColor="#e39a4f" />
      </linearGradient>
      <linearGradient id={p("g-daylight")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f7dfae" stopOpacity="0.85" />
        <stop offset="1" stopColor="#c99a5a" stopOpacity="0.45" />
      </linearGradient>
      <linearGradient id={p("g-glass")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0d1a3a" stopOpacity="0.9" />
        <stop offset="1" stopColor="#02050d" stopOpacity="1" />
      </linearGradient>
      <linearGradient id={p("g-screen")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#12306e" />
        <stop offset="1" stopColor="#0a1a3d" />
      </linearGradient>
      <linearGradient id={p("g-edge-blue")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#1f6bff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#6aa4ff" stopOpacity="1" />
        <stop offset="1" stopColor="#1f6bff" stopOpacity="0" />
      </linearGradient>
      <clipPath id={p("clip-arches")}>
        <path d={ARCH_MAIN} />
        <path d={ARCH_SIDE} />
      </clipPath>
    </defs>
  );
}

/** Central pointed (Abbasid) arch and a smaller side arch — also used as clip for the market view */
export const ARCH_MAIN = "M770 560 L770 300 Q770 176 960 104 Q1150 176 1150 300 L1150 560 Z";
export const ARCH_SIDE = "M430 560 L430 356 Q430 282 530 236 Q630 282 630 356 L630 560 Z";

/** The one desk: identical geometry in every era. Material overlays are separate layers. */
export const DESK_TOP = "M360 560 L1560 560 L1780 900 L140 900 Z";

export function Room({ gid = "" }: { gid?: string }) {
  return <rect x="-200" y="-100" width="2000" height="1100" fill={`url(#g-room${gid})`} />;
}

export function DeskSurface({ gid = "" }: { gid?: string }) {
  return (
    <g>
      <path d={DESK_TOP} fill={`url(#g-desk${gid})`} />
      {/* back edge highlight */}
      <path d="M360 560 L1560 560" stroke="#fff" strokeOpacity="0.07" strokeWidth="2" />
    </g>
  );
}

/** Wood grain overlay (Abbasid → 1940s) */
export function DeskWood() {
  return (
    <g opacity="0.22" stroke="#000" strokeWidth="1.2" fill="none">
      {[590, 625, 668, 720, 782, 852].map((y, i) => (
        <path key={y} d={`M${330 - i * 36} ${y} C 700 ${y - 8 + (i % 2) * 10}, 1200 ${y + 10 - (i % 2) * 14}, ${1590 + i * 36} ${y}`} />
      ))}
    </g>
  );
}

/** Laminate overlay with steel edge (1950s → 2010s) */
export function DeskLaminate() {
  return (
    <g>
      <path d="M360 560 L1560 560 L1566 569 L354 569 Z" fill="#fff" opacity="0.08" />
      <path d={DESK_TOP} fill="#fff" opacity="0.025" />
    </g>
  );
}

/** Black glass desk with SIENA edge light (2020s → future) */
export function DeskGlass() {
  const gid = "";
  return (
    <g>
      <path d={DESK_TOP} fill={`url(#g-glass${gid})`} />
      <path d="M360 560 L1560 560" stroke={`url(#g-edge-blue${gid})`} strokeWidth="2.5" />
      <path d="M520 600 L1400 600" stroke="#6aa4ff" strokeOpacity="0.08" strokeWidth="1" />
      <ellipse cx="960" cy="640" rx="520" ry="50" fill={`url(#g-blue${gid})`} opacity="0.35" />
    </g>
  );
}

type Headwear = "turban" | "fedora" | "none" | "cap";
/** Dignified background silhouette; feet at (x, y). */
export function Person({
  x, y, s = 1, hat = "none", fill = "#000", opacity = 0.55, pose = "stand",
}: { x: number; y: number; s?: number; hat?: Headwear; fill?: string; opacity?: number; pose?: "stand" | "reach" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill} opacity={opacity}>
      <circle cx="0" cy="-150" r="13" />
      <path d="M-22 -132 Q0 -140 22 -132 L28 -60 L20 0 L6 0 L2 -58 L-2 -58 L-6 0 L-20 0 L-28 -60 Z" />
      {pose === "reach" ? <path d="M20 -126 L58 -104 L55 -97 L18 -112 Z" /> : <path d="M22 -128 L30 -70 L24 -70 L18 -120 Z" />}
      <path d="M-22 -128 L-30 -70 L-24 -70 L-18 -120 Z" />
      {hat === "turban" && <ellipse cx="0" cy="-160" rx="17" ry="11" />}
      {hat === "turban" && <path d="M-26 -132 Q0 -122 26 -132 L34 0 L-34 0 Z" />}
      {hat === "fedora" && <path d="M-20 -160 L20 -160 L16 -163 L13 -176 L-13 -176 L-16 -163 Z" />}
      {hat === "cap" && <path d="M-14 -162 Q0 -172 14 -162 L20 -158 L-14 -158 Z" />}
    </g>
  );
}

export function Glow({ cx, cy, rx, ry, kind = "warm", opacity = 1, gid = "" }: { cx: number; cy: number; rx: number; ry: number; kind?: "white" | "cyan" | "warm" | "blue" | "green"; opacity?: number; gid?: string }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#g-${kind}${gid})`} opacity={opacity} />;
}

/** Small decorative UI window used in the automation clutter & convergence */
export function AppWindow({ x, y, w = 200, h = 124, title, children }: { x: number; y: number; w?: number; h?: number; title: string; children?: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="10" fill="#0b1630" fillOpacity="0.88" stroke="#6f8fd8" strokeOpacity="0.35" />
      <rect width={w} height="22" rx="10" fill="#15254a" />
      <rect y="12" width={w} height="10" fill="#15254a" />
      <circle cx="12" cy="11" r="3" fill="#ff6b6b" opacity="0.8" />
      <circle cx="22" cy="11" r="3" fill="#ffcf5c" opacity="0.8" />
      <circle cx="32" cy="11" r="3" fill="#63d68b" opacity="0.8" />
      <text x="44" y="15" fill="#c8d6ff" fontSize="10" fontFamily="var(--font-text), sans-serif" letterSpacing="0.04em">{title}</text>
      {children ?? (
        <g fill="#8fb0ff" fillOpacity="0.28">
          <rect x="12" y="34" width={w * 0.5} height="8" rx="3" />
          <rect x="12" y="50" width={w * 0.72} height="6" rx="3" />
          <rect x="12" y="64" width={w * 0.62} height="6" rx="3" />
          <rect x="12" y="84" width={w * 0.3} height="26" rx="4" fillOpacity="0.2" />
          <rect x={w * 0.36} y="84" width={w * 0.3} height="26" rx="4" fillOpacity="0.2" />
          <rect x={w * 0.7 - 6} y="84" width={w * 0.3} height="26" rx="4" fillOpacity="0.2" />
        </g>
      )}
    </g>
  );
}
