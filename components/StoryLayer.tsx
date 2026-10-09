"use client";
/**
 * StoryLayer — the optional, full-screen Evolution experience.
 * The main page stays where the visitor left it (scroll is locked, then restored exactly);
 * the story scrolls inside its own container, so the existing scroll-scrubbed timeline and
 * the SIENA reveal run unchanged. Story assets load only when the layer is opened.
 *
 * Controls: × Close · ESC · browser Back · Skip to AI · a thin progress line.
 * Deep links: /#evolution opens at the start; /#evolution/<era id> (e.g. /#evolution/ai) opens at that chapter.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { EvolutionTimeline, type TimelineApi } from "./EvolutionTimeline";
import { SienaReveal } from "./SienaReveal";
import { BrandLogo } from "./BrandLogo";
import { TailSymbol } from "./flux/TailSymbol";
import { ERAS } from "@/content/eras";
import { SOLUTIONS_ARRIVE_EVENT, STORY_HASH, STORY_OPEN_EVENT, STORY_OPENED_EVENT, type FnChip } from "@/lib/story";
import { REDUCED_QUERY } from "@/lib/mode";
import { useChapterSettle } from "@/lib/useChapterSettle";
import type { AvailablePlate } from "@/lib/plates.server";

type Phase = "closed" | "open" | "closing";
const FADE_MS = 450;
const AI_INDEX = ERAS.findIndex((e) => e.id === "ai");

/** "#evolution" → "" (start); "#evolution/ai" → "ai"; anything else → null */
function storyHash(hash: string): string | null {
  if (hash === STORY_HASH) return "";
  if (hash.startsWith(STORY_HASH + "/")) return decodeURIComponent(hash.slice(STORY_HASH.length + 1));
  return null;
}

export function StoryLayer({ plates }: { plates: AvailablePlate[] }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const [api, setApi] = useState<TimelineApi | null>(null);
  const [pastAI, setPastAI] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const afterClose = useRef<string | null>(null);
  const savedY = useRef(0);
  const startChapter = useRef<string>("");
  const ownsHistory = useRef(false); // we pushed a #evolution history entry for this visit
  const ignorePop = useRef(false);
  const phaseRef = useRef<Phase>("closed");
  phaseRef.current = phase;

  const open = useCallback((chapter = "", push = true) => {
    if (phaseRef.current !== "closed") return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    savedY.current = window.scrollY;
    startChapter.current = chapter;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (push) {
      history.pushState({ sienaStory: true }, "", STORY_HASH + (chapter ? "/" + chapter : ""));
      ownsHistory.current = true;
    }
    setPastAI(false);
    setPhase("open");
  }, []);

  /** fromHistory: the browser already went back (Back button), so don't touch history again */
  const close = useCallback((thenGoTo?: string, fromHistory = false) => {
    if (phaseRef.current !== "open") return;
    afterClose.current = thenGoTo ?? null;
    if (!fromHistory && ownsHistory.current && storyHash(window.location.hash) !== null) {
      ignorePop.current = true;
      history.back(); // removes our #evolution entry, so Back afterwards leaves nothing behind
    } else if (!fromHistory && storyHash(window.location.hash) !== null) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    ownsHistory.current = false;
    setPhase("closing");
  }, []);

  // openers: #evolution links, [data-open-story] elements, the custom event, deep links, Back/Forward
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.(`a[href="${STORY_HASH}"], [data-open-story]`);
      if (!el || el.closest(".story-layer")) return;
      e.preventDefault();
      open();
    };
    const onOpenEvent = () => open();
    const onPop = () => {
      if (ignorePop.current) { ignorePop.current = false; return; }
      const ch = storyHash(window.location.hash);
      if (phaseRef.current === "open" && ch === null) close(undefined, true); // Back: close, stay on the site
      else if (phaseRef.current === "closed" && ch !== null) { ownsHistory.current = true; open(ch, false); } // Forward
    };
    document.addEventListener("click", onClick);
    window.addEventListener(STORY_OPEN_EVENT, onOpenEvent);
    window.addEventListener("popstate", onPop);
    // deep link (/#evolution, /#evolution/ai, or via /story): open on top of the home page,
    // with the home page itself as the entry Back returns to
    const ch = storyHash(window.location.hash);
    if (ch !== null) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      open(ch);
    }
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener(STORY_OPEN_EVENT, onOpenEvent);
      window.removeEventListener("popstate", onPop);
    };
  }, [open, close]);

  // while open: lock the page behind, ESC closes, keep keyboard focus inside the story
  useEffect(() => {
    if (phase === "closed") return;
    document.documentElement.classList.add("story-open");
    if (phase !== "open") return;
    window.dispatchEvent(new CustomEvent(STORY_OPENED_EVENT));
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key !== "Tab" || !layerRef.current) return;
      const items = Array.from(
        layerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      ).filter((el) =>
        el.tabIndex >= 0 &&
        (el.checkVisibility ? el.checkVisibility({ visibilityProperty: true }) : el.offsetParent !== null),
      );
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      const inside = layerRef.current.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !inside)) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, close]);

  // iOS Safari: touches on the story's frame (top bar, controls) must never scroll the page behind
  useEffect(() => {
    const el = layerRef.current;
    if (!el || phase === "closed") return;
    const block = (e: TouchEvent) => {
      if (!(e.target as Element).closest(".story-scroll")) e.preventDefault();
    };
    el.addEventListener("touchmove", block, { passive: false });
    return () => el.removeEventListener("touchmove", block);
  }, [phase]);

  // closing: fade out, unmount, restore the exact page position and focus, then optionally glide to a section
  useEffect(() => {
    if (phase !== "closing") return;
    const t = window.setTimeout(() => {
      setPhase("closed");
      setScroller(null);
      setApi(null);
      document.documentElement.classList.remove("story-open");
      window.scrollTo({ top: savedY.current, behavior: "auto" });
      if ("scrollRestoration" in history) history.scrollRestoration = "auto";
      const target = afterClose.current ? document.querySelector(afterClose.current) : null;
      if (target) {
        const reduced = window.matchMedia(REDUCED_QUERY).matches;
        requestAnimationFrame(() => target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }));
        (target as HTMLElement).focus?.({ preventScroll: true });
      } else {
        returnFocus.current?.focus?.({ preventScroll: true });
      }
    }, FADE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // deep link to a chapter: jump there instantly once the timeline is ready (otherwise the story starts at the beginning)
  useEffect(() => {
    if (!api || !startChapter.current) return;
    const i = ERAS.findIndex((e) => e.id === startChapter.current);
    startChapter.current = "";
    if (i > 0) requestAnimationFrame(() => api.jump(i, "auto"));
  }, [api]);

  // progress line + hide "Skip to AI" once the AI chapter has been reached
  useEffect(() => {
    if (!scroller) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = scroller.scrollHeight - scroller.clientHeight;
      const p = max > 0 ? scroller.scrollTop / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      if (api && AI_INDEX >= 0) setPastAI(scroller.scrollTop >= api.offsetOf(AI_INDEX) - scroller.clientHeight * 0.3);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { scroller.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [scroller, api]);

  // in-story links to the main site (#solutions, #contact): close the story, then go there
  const onStoryClick = (e: React.MouseEvent) => {
    const a = (e.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const href = a.getAttribute("href")!;
    if (href.length < 2 || !document.querySelector(href) || a.closest(".evo")) return;
    e.preventDefault();
    // the story's ending → Solutions: hand over where the six function chips are, so they can unfold into the modules
    if (a.matches("[data-story-cta], .reveal-secondary")) {
      const chips: FnChip[] = Array.from(layerRef.current?.querySelectorAll<HTMLElement>("[data-fn]") ?? []).map((el) => {
        const r = el.getBoundingClientRect();
        return { id: el.dataset.fn!, label: el.textContent ?? "", rect: { x: r.left, y: r.top, w: r.width, h: r.height } };
      });
      window.dispatchEvent(new CustomEvent(SOLUTIONS_ARRIVE_EVENT, { detail: { chips } }));
    }
    close(href);
  };

  // soft settle at each era so a fast swipe can't skip a whole chapter
  useChapterSettle(scroller, api, ERAS.length);

  const skipToAI = () => api?.jump(AI_INDEX);

  if (phase === "closed") return null;

  return (
    <div
      ref={layerRef}
      className="story-layer"
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-label="The Evolution of Business Systems"
      onClick={onStoryClick}
    >
      <div className="story-progress" aria-hidden="true">
        <span ref={barRef} />
      </div>
      <div className="story-bar">
        <span className="story-brand" aria-hidden="true">
          <TailSymbol className="site-brand-symbol" sizes="40px" />
          <BrandLogo variant="wordmark" alt="" className="site-brand-word" sizes="120px" feather={false} />
        </span>
      </div>
      <div className="story-controls">
        <button type="button" className="story-skip" onClick={skipToAI} data-hidden={pastAI || !api ? "" : undefined} tabIndex={pastAI ? -1 : 0}>
          Skip to AI <span aria-hidden="true">→</span>
        </button>
        <button type="button" className="story-close" ref={closeBtn} onClick={() => close()} aria-label="Close the evolution story">
          <span aria-hidden="true">×</span>
          <span className="story-close-label">Close</span>
        </button>
      </div>
      <div className="story-scroll" ref={setScroller}>
        {scroller && (
          <>
            <EvolutionTimeline plates={plates} scroller={scroller} onApi={setApi} />
            <SienaReveal scroller={scroller} story />
          </>
        )}
      </div>
    </div>
  );
}
