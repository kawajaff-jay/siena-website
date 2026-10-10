"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "../preview/preview.module.css";
import { CURSOR_DESIGNS } from "./designs";

/** Switcher for the cursor previews only. */
export function CursorBar() {
  const path = (usePathname() || "").replace(/\/$/, "");
  const links: { href: string; label: string; name?: string }[] = [
    { href: "/preview-cursor", label: "All" },
    ...CURSOR_DESIGNS.map((d) => ({ href: `/preview-cursor/${d.v}`, label: d.n, name: d.name })),
    { href: "/", label: "Current site" },
  ];
  return (
    <nav className={s.bar} aria-label="Cursor previews">
      <span className={s.barTag}>Cursor preview</span>
      {links.map((l) => (
        <Link key={l.href} href={l.href} className={s.barLink} aria-current={path === l.href ? "page" : undefined}>
          {l.label}
          {l.name && <span className={s.barName}> · {l.name}</span>}
        </Link>
      ))}
    </nav>
  );
}
