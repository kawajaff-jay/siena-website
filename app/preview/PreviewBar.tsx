"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "./preview.module.css";

const LINKS: { href: string; label: string; name?: string }[] = [
  { href: "/preview", label: "All" },
  { href: "/preview/a", label: "A", name: "Ledger" },
  { href: "/preview/b", label: "B", name: "Console" },
  { href: "/preview/c", label: "C", name: "Signal" },
  { href: "/preview/d", label: "D", name: "Neural" },
  { href: "/preview/e", label: "E", name: "Prompt" },
  { href: "/preview/f", label: "F", name: "Aurora" },
  { href: "/preview/g", label: "G", name: "Blueprint" },
  { href: "/preview/h", label: "H", name: "Dusk" },
  { href: "/preview/i", label: "I", name: "Prism" },
  { href: "/preview/j", label: "J", name: "Bloom" },
  { href: "/preview/k", label: "K", name: "Genesis" },
  { href: "/preview/l", label: "L", name: "Flux" },
  { href: "/preview/m", label: "M", name: "Lumière" },
  { href: "/preview/n", label: "N", name: "Noir" },
  { href: "/preview/o", label: "O", name: "Flux Blue" },
  { href: "/preview/p", label: "P", name: "Flux Complete" },
  { href: "/preview/q", label: "Q", name: "Wheel · Tide" },
  { href: "/preview/r", label: "R", name: "Wheel · Dial" },
  { href: "/preview/s", label: "S", name: "Wheel · Drum" },
  { href: "/preview/t", label: "T", name: "Wheel · Lens" },
  { href: "/preview/u", label: "U", name: "Wheel · Arc" },
  { href: "/preview/classic", label: "Classic", name: "old home" },
  { href: "/", label: "Current site" },
];

/** Floating switcher so the three directions can be compared side by side. */
export function PreviewBar() {
  const path = (usePathname() || "").replace(/\/$/, "");
  return (
    <nav className={s.bar} aria-label="Design previews">
      <span className={s.barTag}>Preview</span>
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={s.barLink} aria-current={path === l.href ? "page" : undefined}>
          {l.label}
          {l.name && <span className={s.barName}> · {l.name}</span>}
        </Link>
      ))}
    </nav>
  );
}
