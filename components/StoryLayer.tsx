"use client";
/**
 * StoryLayer — the optional, full-screen Evolution experience.
 * The main page stays where the visitor left it (scroll is only locked, never moved);
 * the story scrolls inside its own container, so the existing scroll-scrubbed timeline and
 * the SIENA reveal run unchanged. Story assets load only when the layer is opened.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { EvolutionTimeline } from "./EvolutionTimeline";
import { SienaReveal } from "./SienaReveal";
import { BrandLogo } from "./BrandLogo";
import { STORY_HASH, STORY_OPEN_EVENT } from "@/lib/story";
import { REDUCED_QUERY } from "@/lib/mode";
import type { AvailablePlate } from "@/lib/plates.server";

type Phase = "closed" | "open" | "closing";
const FADE_MS = 450;

export function StoryLayer({ plates }: { plates: AvailablePlate[] }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const afterClose = useRef<string | null>(null);

  const open = useCallback(() => {
    setPhase((p) => {
      if (p !== "closed") return p;
      returnFocus.current = document.activeElement as HTMLElement | null;
      return "open";
    });
  }, []);

  const close = useCallback((thenGoTo?: string) => {
    afterClose.current = thenGoTo ?? null;
    setPhase((p) => (p === "open" ? "closing" : p));
  }, []);

  // openers: #evolution links, [data-open-story] elements, the custom event, and a #evolution deep link
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.(`a[href="${STORY_HASH}"], [data-open-story]`);
      if (!el || el.closest(".story-layer")) return;
      e.preventDefault();
      open();
    };
    document.addEventListener("click", onClick);
    window.addEventListener(STORY_OPEN_EVENT, open);
    if (window.location.hash === STORY_HASH) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      open();
    }
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener(STORY_OPEN_EVENT, open);
    };
  }, [open]);

  // while open: lock the page behind (its scroll position is kept), ESC closes, focus the close button
  useEffect(() => {
    if (phase === "closed") return;
    const html = document.documentElement;
    html.classList.add("story-open");
    if (phase === "open") closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, close]);

  // closing: fade out, unmount, unlock, restore focus, then optionally glide to a section of the main site
  useEffect(() => {
    if (phase !== "closing") return;
    const t = window.setTimeout(() => {
      setPhase("closed");
      setScroller(null);
      document.documentElement.classList.remove("story-open");
      returnFocus.current?.focus?.({ preventScroll: true });
      const target = afterClose.current && document.querySelector(afterClose.current);
      if (target) {
        const reduced = window.matchMedia(REDUCED_QUERY).matches;
        requestAnimationFrame(() => target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }));
      }
    }, FADE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // in-story links to the main site (#solutions, #contact): close the story, then go there
  const onStoryClick = (e: React.MouseEvent) => {
    const a = (e.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const href = a.getAttribute("href")!;
    if (href.length < 2 || !document.querySelector(href)) return;
    e.preventDefault();
    close(href);
  };

  if (phase === "closed") return null;

  return (
    <div
      className="story-layer"
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-label="The Evolution of Business Systems"
      onClick={onStoryClick}
    >
      <div className="story-bar">
        <span className="story-brand" aria-hidden="true">
          <BrandLogo variant="symbol" alt="" className="site-brand-symbol" sizes="40px" />
          <BrandLogo variant="wordmark" alt="" className="site-brand-word" sizes="120px" feather={false} />
        </span>
        <button type="button" className="story-close" ref={closeBtn} onClick={() => close()} aria-label="Close the evolution story">
          <span aria-hidden="true">×</span>
          <span className="story-close-label">Close</span>
        </button>
      </div>
      <div className="story-scroll" ref={setScroller}>
        {scroller && (
          <>
            <EvolutionTimeline plates={plates} scroller={scroller} />
            <SienaReveal scroller={scroller} />
          </>
        )}
      </div>
    </div>
  );
}
