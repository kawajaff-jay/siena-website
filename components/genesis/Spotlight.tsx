"use client";
import { useEffect } from "react";

/**
 * Pointer effects for the sections below the hero, by data attribute:
 *  [data-spot]   sets --mx / --my (cursor position inside the element) for a light that follows the cursor
 *  [data-tilt]   tilts the element slightly toward the cursor (--rx / --ry)
 *  [data-magnet] pulls the element a little toward the cursor
 */
export function Spotlight() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let spot: HTMLElement | null = null, magnet: HTMLElement | null = null;
    const reset = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.removeProperty("--rx"); el.style.removeProperty("--ry");
      el.removeAttribute("data-lit");
    };
    const move = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const s = (t?.closest?.("[data-spot]") as HTMLElement | null) ?? null;
      if (s !== spot) { reset(spot); spot = s; }
      if (s) {
        const r = s.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        s.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        s.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
        s.setAttribute("data-lit", "");
        if (s.hasAttribute("data-tilt")) {
          s.style.setProperty("--rx", `${((0.5 - y) * 7).toFixed(2)}deg`);
          s.style.setProperty("--ry", `${((x - 0.5) * 9).toFixed(2)}deg`);
        }
      }
      const m = (t?.closest?.("[data-magnet]") as HTMLElement | null) ?? null;
      if (m !== magnet) { if (magnet) magnet.style.transform = ""; magnet = m; }
      if (m) {
        const r = m.getBoundingClientRect();
        m.style.transform = `translate(${((e.clientX - (r.left + r.width / 2)) * 0.25).toFixed(1)}px, ${((e.clientY - (r.top + r.height / 2)) * 0.35).toFixed(1)}px)`;
      }
    };
    const leave = () => { reset(spot); spot = null; if (magnet) magnet.style.transform = ""; magnet = null; };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => { document.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); };
  }, []);
  return null;
}
