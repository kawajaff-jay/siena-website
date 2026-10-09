"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "../preview/preview.module.css";
import { CORE_DESIGNS } from "./designs";

/** Switcher for the energy-core previews only. */
export function CoreBar() {
  const path = (usePathname() || "").replace(/\/$/, "");
  const links = [
    { href: "/preview-core", label: "All" },
    ...CORE_DESIGNS.map((d) => ({ href: `/preview-core/${d.v}`, label: d.n, name: d.name })),
    { href: "/", label: "Current site" },
  ];
  return (
    <nav className={s.bar} aria-label="Energy core previews">
      <span className={s.barTag}>Core preview</span>
      {links.map((l) => (
        <Link key={l.href} href={l.href.startsWith("/preview-core/") ? `${l.href}#what` : l.href} className={s.barLink} aria-current={path === l.href ? "page" : undefined}>
          {l.label}
          {"name" in l && l.name && <span className={s.barName}> · {l.name}</span>}
        </Link>
      ))}
    </nav>
  );
}
