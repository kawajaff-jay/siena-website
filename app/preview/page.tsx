import Link from "next/link";
import s from "./preview.module.css";

const DESIGNS = [
  {
    href: "/preview/a", name: "A · Ledger", mood: "Editorial · light · serif",
    text: "A warm paper page with large serif type and numbered sections. Solutions read like an index of a ledger and open in place to show how each one works.",
    swatch: ["#f4f1ea", "#10131c", "#1f4fe0"],
  },
  {
    href: "/preview/b", name: "B · Console", mood: "Product · dark · bento grid",
    text: "A modern software-product look. A live workflow runs in the hero, solutions sit in a bento grid, and every card shows its outcome first.",
    swatch: ["#05070d", "#0d1324", "#4c8dff"],
  },
  {
    href: "/preview/c", name: "C · Signal", mood: "Bold · Swiss · electric blue",
    text: "Huge type on full-bleed SIENA blue, a moving ticker of what SIENA connects, and a sticky split layout. Loud, confident and very memorable.",
    swatch: ["#2f6bff", "#0a0a0a", "#ffffff"],
  },
  {
    href: "/preview/d", name: "D · Neural", mood: "AI · dark · living network",
    text: "SIENA at the centre of a glowing network: signals pulse out to all eight modules, and each solution card shows which other modules it talks to.",
    swatch: ["#02040b", "#3d7bff", "#8b6cff"],
  },
  {
    href: "/preview/e", name: "E · Prompt", mood: "AI · light · conversation",
    text: "The homepage is a conversation with SIENA. A prompt types itself, then each section is an answer, and solutions open to show the workflow step by step.",
    swatch: ["#f6f6f3", "#15171c", "#2563eb"],
  },
  {
    href: "/preview/f", name: "F · Aurora", mood: "AI · light · soft glass",
    text: "Calm and human: soft moving light, frosted glass cards, orbits around the SIENA symbol and a sideways-scrolling solutions carousel.",
    swatch: ["#f7f8fc", "#b9c9ff", "#9a7bff"],
  },
  {
    href: "/preview/g", name: "G · Blueprint", mood: "AI · technical · schematic",
    text: "SIENA drawn like an engineered system on blueprint paper. A wiring diagram with live signals, each module’s workflow as a flowchart, and principles as a spec table.",
    swatch: ["#0a2a66", "#eef5ff", "#ffd166"],
  },
  {
    href: "/preview/h", name: "H · Aurora Dusk", mood: "Aurora · dark · northern lights",
    text: "The aurora at night: green-to-violet ribbons drifting over a starry sky, dark glass cards, and a constellation line joining Connect → Automate → Intelligence.",
    swatch: ["#050816", "#5cf2c0", "#a07bff"],
  },
  {
    href: "/preview/i", name: "I · Aurora Prism", mood: "Aurora · bright · iridescent",
    text: "Light refracted through one lens: an iridescent glass orb holding the SIENA symbol, a Venn of the three capabilities with SIENA at the centre, and rainbow-edged glass tiles.",
    swatch: ["#fbfbfe", "#b38cff", "#ff9fd6"],
  },
  {
    href: "/preview/j", name: "J · Aurora Bloom", mood: "Aurora · warm · sunrise",
    text: "A warm sunrise of peach, rose and lilac with soft film grain. Big calm type, breathing orbs, and solution cards that stack on top of each other as you scroll.",
    swatch: ["#fff8f2", "#ffb39a", "#c4a6ff"],
  },
  {
    href: "/preview/k", name: "K · Aurora Genesis", mood: "Aurora · light · scroll-built logo",
    text: "Aurora light with a cinematic hero: as you scroll, scattered data points gather, link up like a neural network, trace the S, and resolve into the real SIENA logo.",
    swatch: ["#f7f8fc", "#3b6cff", "#7fe3d3"],
  },
  {
    href: "/preview/l", name: "L · Genesis Flux", mood: "Interactive · futuristic HUD",
    text: "Interactive Genesis, futuristic: holographic grid floor, scanlines and a targeting reticle. Push the particle network with your cursor, click to pulse it, then run any module orbiting the logo.",
    swatch: ["#03050d", "#33e1ff", "#ff4fd8"],
  },
  {
    href: "/preview/m", name: "M · Genesis Lumière", mood: "Interactive · elegant futuristic",
    text: "Interactive Genesis, elegant: pearl light, champagne-gold orbits and serif type. Your cursor is a soft light the particles drift toward; the modules orbit the logo like jewellery.",
    swatch: ["#f7f4ef", "#b08a4f", "#4d6bff"],
  },
  {
    href: "/preview/n", name: "N · Genesis Noir", mood: "Interactive · noir futuristic",
    text: "Interactive Genesis, noir: black, grain and venetian-blind light. Your cursor is a flashlight that reveals the hidden network; SIENA blue is the only colour.",
    swatch: ["#000000", "#ffffff", "#2f7bff"],
  },
  {
    href: "/preview/o", name: "O · Genesis Flux Blue", mood: "Interactive · futuristic HUD · all blue",
    text: "Flux with every pink and magenta accent removed: particles, pulses, trace, glitch, haze and labels now run in cyan and SIENA electric blue only.",
    swatch: ["#03050d", "#33e1ff", "#2f7bff"],
  },
];

export default function PreviewIndex() {
  return (
    <main className={s.index}>
      <p className={s.kicker}>SIENA · design previews</p>
      <h1 className={s.title}>Fifteen directions for the homepage</h1>
      <p className={s.lead}>
        Same approved copy, fifteen different layouts and styles. These pages are hidden from search and don’t change the
        live homepage. Use the bar at the bottom to switch between them.
      </p>
      <ul className={s.grid}>
        {DESIGNS.map((d) => (
          <li key={d.href}>
            <Link href={d.href} className={s.card}>
              <span className={s.swatches} aria-hidden="true">
                {d.swatch.map((c) => <span key={c} style={{ background: c }} />)}
              </span>
              <span className={s.cardMood}>{d.mood}</span>
              <span className={s.cardName}>{d.name}</span>
              <span className={s.cardText}>{d.text}</span>
              <span className={s.cardGo}>Open preview →</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
