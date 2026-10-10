import type { CursorStyle } from "@/components/genesis/Genesis";

/** Subtle cursor styles for the hero (a preview set of their own). */
export const CURSOR_DESIGNS: { v: CursorStyle; n: string; name: string; mood: string; text: string; swatch: string[] }[] = [
  {
    v: "glow", n: "1", name: "Soft Glow", mood: "Ambient · barely there",
    text: "A faint pool of cyan light drifts after your cursor, as if you were carrying a small lamp across the hero. No shapes, just a gentle glow.",
    swatch: ["#03050d", "#33e1ff", "#7aa2ff"],
  },
  {
    v: "dot", n: "2", name: "Dot & Ring", mood: "Minimal · precise",
    text: "A tiny cyan dot sits on your cursor and a thin ring follows a moment behind it. Clean and modern, like a premium product site.",
    swatch: ["#03050d", "#33e1ff", "#e8f6ff"],
  },
  {
    v: "trail", n: "3", name: "Light Trail", mood: "Fluid · quiet",
    text: "Moving the cursor leaves a short, thin line of light that fades in under half a second. Nothing shows when the cursor is still.",
    swatch: ["#03050d", "#33e1ff", "#0b1a33"],
  },
];
