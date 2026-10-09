import type { EnergyVariant } from "@/components/flux/EnergyCore";

/** The four energy-core designs (a preview set of their own, separate from /preview). */
export const CORE_DESIGNS: { v: EnergyVariant; n: string; name: string; mood: string; text: string; swatch: string[] }[] = [
  {
    v: "reactor", n: "1", name: "Reactor", mood: "Shockwaves · spectrum ring · sparks",
    text: "The S hums like a reactor core: shockwaves roll out from it, a spectrum ring pulses around it and sparks fly off its edges. Click and three bright rings burst out at once.",
    swatch: ["#03050d", "#33e1ff", "#ff4fd8"],
  },
  {
    v: "storm", n: "2", name: "Plasma Storm", mood: "Lightning · containment ring",
    text: "The S held in a containment ring, with lightning cracking from its edges to the ring. Bring your cursor near and the lightning reaches for it; click for a full discharge.",
    swatch: ["#03050d", "#e6f7ff", "#33e1ff"],
  },
  {
    v: "resonance", n: "3", name: "Resonance", mood: "Waveforms · sound ripples",
    text: "Cyan, pink and blue waveforms run across the whole frame and swell as they pass through the S, which vibrates in time with them. Click to send a pulse rippling out along the waves.",
    swatch: ["#03050d", "#33e1ff", "#7aa2ff"],
  },
  {
    v: "field", n: "4", name: "Field", mood: "Particle skin · energy vortex",
    text: "The S shimmers under a skin of vibrating particles while a vortex of energy spirals into it and field lines flow around it. Click and the whole vortex blasts outward.",
    swatch: ["#03050d", "#ff4fd8", "#33e1ff"],
  },
];
