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
];

export default function PreviewIndex() {
  return (
    <main className={s.index}>
      <p className={s.kicker}>SIENA · design previews</p>
      <h1 className={s.title}>Three directions for the homepage</h1>
      <p className={s.lead}>
        Same approved copy, three different layouts and styles. These pages are hidden from search and don’t change the
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
