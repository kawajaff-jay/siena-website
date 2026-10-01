"use client";
/**
 * Soft chapter settling for the Evolution story.
 *
 * Scrolling stays native, smooth and reversible. Only when a *fast* user scroll (a trackpad fling,
 * a hard swipe) carries the story across the start of an era does it pause there for a short,
 * readable moment, then let go. Slow scrolling, the era rail, "Skip to AI" and deep links are
 * never interrupted. The timeline's own scrub smoothing makes the stop feel like resistance,
 * not a cut.
 */
import { useEffect } from "react";
import type { TimelineApi } from "@/components/EvolutionTimeline";
import { REDUCED_QUERY } from "@/lib/mode";

const FAST = 1.4; // px per ms (~1400 px/s): slower than this is "reading speed" and never interrupted
const HOLD_MS = 650; // the settle moment
const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Spacebar", "Home", "End"]);

export function useChapterSettle(scroller: HTMLElement | null, api: TimelineApi | null, count: number) {
  useEffect(() => {
    if (!scroller || !api || window.matchMedia(REDUCED_QUERY).matches) return;

    let points: number[] = [];
    const measure = () => {
      points = [];
      for (let i = 1; i < count; i++) points.push(Math.round(api.offsetOf(i)));
    };
    measure();

    let lastTop = scroller.scrollTop;
    let lastT = performance.now();
    let speed = 0;
    let holdUntil = 0;
    let lastInput = 0; // wheel / key / touch activity: only user-driven scrolling is settled
    let touching = false;
    let autoUntil = 0; // rail jumps / Skip to AI: programmatic glides are never settled

    const now = () => performance.now();
    const holding = () => now() < holdUntil;
    const userDriven = () => now() > autoUntil && (touching || now() - lastInput < 700);

    const onScroll = () => {
      const t = now();
      const top = scroller.scrollTop;
      const dt = Math.max(1, t - lastT);
      speed = speed * 0.5 + (Math.abs(top - lastTop) / dt) * 0.5;

      if (holding()) {
        // keep the settle point while holding (absorbs leftover momentum)
        if (Math.abs(top - holdAt) > 1) scroller.scrollTop = holdAt;
      } else if (userDriven() && speed > FAST && top !== lastTop) {
        const down = top > lastTop;
        const crossed = down
          ? points.find((p) => p > lastTop && p <= top)
          : [...points].reverse().find((p) => p < lastTop && p >= top);
        if (crossed !== undefined) {
          holdAt = crossed;
          holdUntil = t + HOLD_MS;
          scroller.scrollTop = crossed;
          speed = 0;
          lastTop = crossed;
          lastT = t;
          return;
        }
      }
      lastTop = scroller.scrollTop;
      lastT = t;
    };
    let holdAt = 0;

    // during the settle moment, further input is absorbed (then normal scrolling resumes)
    const onWheel = (e: WheelEvent) => {
      lastInput = now();
      if (holding()) e.preventDefault();
    };
    const onTouchStart = () => { touching = true; lastInput = now(); };
    const onTouchMove = (e: TouchEvent) => {
      lastInput = now();
      if (holding()) e.preventDefault();
    };
    const onTouchEnd = () => { touching = false; lastInput = now(); }; // momentum continues ~700ms
    const onKey = (e: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(e.key)) return;
      lastInput = now();
      if (holding()) e.preventDefault();
    };

    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.("[data-rail], .story-skip")) { autoUntil = now() + 2000; lastInput = 0; }
    };
    document.addEventListener("click", onClick, true);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchmove", onTouchMove, { passive: false });
    scroller.addEventListener("touchend", onTouchEnd, { passive: true });
    scroller.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", measure);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchmove", onTouchMove);
      scroller.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", measure);
      document.removeEventListener("click", onClick, true);
    };
  }, [scroller, api, count]);
}
