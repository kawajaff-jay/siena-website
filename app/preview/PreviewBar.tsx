"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "./preview.module.css";

const LINKS: { href: string; label: string; name?: string }[] = [
  { href: "/preview", label: "All" },
  { href: "/preview/a", label: "A", name: "Ledger" },
  { href: "/preview/b", label: "B", name: "Console" },
  { href: "/preview/c", label: "C", name: "Signal" },
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
