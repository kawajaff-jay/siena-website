import type { InterludeVariant } from "@/components/flux/LogoInterlude";

/** The logo-interlude designs (a preview set of their own, separate from /preview). */
export const LOGO_DESIGNS: { v: InterludeVariant; n: string; name: string; mood: string; text: string; swatch: string[] }[] = [
  {
    v: "sweep", n: "1", name: "Light Sweep", mood: "Calm · premium",
    text: "The S floats gently while a band of light glides across it every few seconds, like light catching polished metal. The line “Built around your business.” fades in word by word.",
    swatch: ["#03050d", "#ffffff", "#33e1ff"],
  },
  {
    v: "zoom", n: "2", name: "Scroll Zoom", mood: "Scroll-driven · bold",
    text: "The section holds still while you scroll and the S grows from small to large in the middle of the screen, then the line appears beneath it. A strong, cinematic pause.",
    swatch: ["#03050d", "#2f7bff", "#33e1ff"],
  },
  {
    v: "marquee", n: "3", name: "Service Marquee", mood: "Editorial · energetic",
    text: "Your six services glide past in large outlined letters behind the S, one row each way, moving with your scroll. Catchy and it reminds visitors what you do.",
    swatch: ["#03050d", "#33e1ff", "#ff4fd8"],
  },
  {
    v: "tilt", n: "4", name: "Tilt", mood: "Interactive · tactile",
    text: "The S tilts toward your cursor like a 3D object, with a glossy highlight and a shadow that move as it turns. When the cursor is away it sways slowly on its own.",
    swatch: ["#03050d", "#e8f6ff", "#7aa2ff"],
  },
  {
    v: "lockup", n: "5", name: "Logo Reveal", mood: "Clean · brand moment",
    text: "The full SIENA logo, with the wordmark, is revealed by a line of light wiping across it as it comes into view, then the line appears below. Simple and confident.",
    swatch: ["#03050d", "#33e1ff", "#e8f6ff"],
  },
];
