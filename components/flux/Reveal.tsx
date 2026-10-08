"use client";
import { useEffect } from "react";

/** Adds data-in="true" to [data-reveal] elements as they scroll into view (CSS does the animation). */
export function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    document.documentElement.dataset.reveal = "on"; /* content is only hidden for the reveal once JS runs */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      els.forEach((el) => (el.dataset.in = "true"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { (e.target as HTMLElement).dataset.in = "true"; io.unobserve(e.target); }
      }),
      { threshold: 0.2 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

/** Counts up to `to` once its parent [data-reveal] block is in view. */
export function Counter({ to, pad = 2 }: { to: number; pad?: number }) {
  return <span data-counter={to} data-pad={pad}>{String(to).padStart(pad, "0")}</span>;
}

/** Drives every [data-counter] (kept separate so counters stay plain server-rendered text without JS). */
export function Counters() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-counter]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement, to = Number(el.dataset.counter), pad = Number(el.dataset.pad || 2);
      io.unobserve(el);
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / 1200);
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3)))).padStart(pad, "0");
        if (k < 1) requestAnimationFrame(step);
      };
      el.textContent = "0".padStart(pad, "0");
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
