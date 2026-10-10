"use client";
import { useEffect, useRef } from "react";
import { TailLockup } from "./TailLockup";
import r from "./footReveal.module.css";

/**
 * Footer brand: the Logo Reveal. As the footer scrolls into view, a line of light wipes across and uncovers the SIENA
 * logo (pink tail included), then the line appears. Replays each time the footer is reached from above.
 */
export function FooterReveal({ className = "", emClass = "" }: { className?: string; emClass?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.dataset.in = ""; return; }
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) el.dataset.in = "";
      else if (en.boundingClientRect.top > 0) delete el.dataset.in;
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={root} className={`${r.root} ${className}`}>
      <span className={r.logo}>
        <TailLockup alt="SIENA — AI Solutions & Systems" sizes="400px" />
      </span>
      <p className={r.line}>
        <span>From scattered data </span>
        <em className={emClass}>to one intelligence.</em>
      </p>
    </div>
  );
}
