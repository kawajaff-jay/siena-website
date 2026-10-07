"use client";
/** Toggles .is-near on the element while it is on (or close to) the screen — idle ambient motion runs only then. */
import { useEffect, type RefObject } from "react";

export function useNear(ref: RefObject<HTMLElement | null>, margin = "15% 0px") {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-near", e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
}
