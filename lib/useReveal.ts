"use client";
/** Adds .is-in to [data-reveal] elements inside the container as they come into view (once). CSS does the rest. */
import { useEffect, type RefObject } from "react";

export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.dataset.reveal = "on";
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    root.querySelectorAll("[data-reveal-item]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}
