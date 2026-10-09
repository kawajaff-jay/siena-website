"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "../preview/preview.module.css";
import { LOGO_DESIGNS } from "./designs";

/** Switcher for the logo-interlude previews only. */
export function LogoBar() {
  const path = (usePathname() || "").replace(/\/$/, "");
  const links: { href: string; label: string; name?: string; hash?: boolean }[] = [
    { href: "/preview-logo", label: "All" },
    ...LOGO_DESIGNS.map((d) => ({ href: `/preview-logo/${d.v}`, label: d.n, name: d.name, hash: true })),
    { href: "/", label: "Current site" },
  ];
  return (
    <nav className={s.bar} aria-label="Logo interlude previews">
      <span className={s.barTag}>Logo preview</span>
      {links.map((l) => (
        <Link key={l.href} href={l.hash ? `${l.href}#interlude` : l.href} className={s.barLink} aria-current={path === l.href ? "page" : undefined}>
          {l.label}
          {l.name && <span className={s.barName}> · {l.name}</span>}
        </Link>
      ))}
    </nav>
  );
}
