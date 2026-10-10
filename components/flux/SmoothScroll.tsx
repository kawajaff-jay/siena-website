"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Smooth, inertial page scrolling for mouse wheels and trackpads on desktop, so the scroll-driven hero glides the way
 * it does with a phone's native momentum scroll (a mouse wheel otherwise jumps the page ~100px per notch).
 * Off on touch devices (they already scroll natively) and for reduced motion. Elements marked [data-lenis-prevent]
 * (the solutions wheel, the Evolution story) keep their own scrolling; it pauses while the story is open.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
    let raf = requestAnimationFrame(function tick(t) { lenis.raf(t); raf = requestAnimationFrame(tick); });
    const html = document.documentElement;
    const mo = new MutationObserver(() => (html.classList.contains("story-open") ? lenis.stop() : lenis.start()));
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => { cancelAnimationFrame(raf); mo.disconnect(); lenis.destroy(); };
  }, []);
  return null;
}
