"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { SOLUTIONS } from "@/content/site";
import t from "./tide.module.css";

const ITEMS = SOLUTIONS.items;
const N = ITEMS.length;

/**
 * Solutions — "Tide". The wheel stays fixed on the left while the page scrolls. Scrolling or swiping ON the
 * wheel turns it (the page scroll is separate); click or arrow keys choose a solution; hover only highlights.
 * The chosen solution's full description is a normal article on the right that you scroll to read.
 */
export function SolutionsTide() {
  const section = useRef<HTMLElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const [sel, setSel] = useState(0);
  /* continuous wheel position the wheel drifts toward; gestures move it freely, it snaps to a solution when they end */
  const target = useRef(0);
  const selRef = useRef(0);
  selRef.current = sel;

  /* the wheel drifts smoothly to the chosen solution */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pos = 0, raf = 0;
    const frame = () => {
      pos = reduce ? target.current : pos + (target.current - pos) * 0.1;
      items.current.forEach((it, i) => {
        if (!it) return;
        const d = i - pos;
        it.style.setProperty("--d", d.toFixed(3));
        it.style.setProperty("--ad", Math.abs(d).toFixed(3));
        it.style.setProperty("--d2", (d * d).toFixed(3));
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* if the reader is further down the previous article, bring them to the top of the new one */
  const toArticleTop = () => {
    const top = section.current?.getBoundingClientRect().top ?? 0;
    if (top < -40) section.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* choose a solution (click, keys, Next) */
  const choose = (i: number, focus = false) => {
    const n = (i + N) % N;
    target.current = n;
    setSel(n);
    if (focus) items.current[n]?.focus();
    toArticleTop();
  };

  /* turn the wheel by scrolling (mouse wheel / trackpad) or swiping ON the wheel; the page scroll stays separate.
     At the first/last solution, further scrolling in that direction is handed back to the page. */
  useEffect(() => {
    const el = wheel.current!;
    const spacing = () => (window.innerWidth < 860 ? 42 : 74);
    let idle = 0, startSel = 0, gesturing = false;
    const begin = () => { if (!gesturing) { gesturing = true; startSel = selRef.current; } };
    const settle = () => {
      gesturing = false;
      const n = Math.round(Math.min(N - 1, Math.max(0, target.current)));
      target.current = n;
      setSel(n);
      if (n !== startSel) toArticleTop();
    };
    const move = (delta: number) => {
      target.current = Math.min(N - 1, Math.max(0, target.current + delta));
      const n = Math.round(target.current);
      if (n !== selRef.current) setSel(n);
    };
    const atEdge = (dir: number) => (dir < 0 && target.current <= 0.001) || (dir > 0 && target.current >= N - 1.001);

    const onWheel = (e: WheelEvent) => {
      const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      if (Math.abs(dy) < Math.abs(e.deltaX) || atEdge(Math.sign(dy))) return; /* let the page scroll */
      e.preventDefault();
      begin();
      move(Math.max(-0.6, Math.min(0.6, dy / 160)));
      window.clearTimeout(idle);
      idle = window.setTimeout(settle, 160);
    };

    let lastY = 0, swiping = false;
    const onStart = (e: TouchEvent) => { lastY = e.touches[0].clientY; swiping = false; };
    const onMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY, dy = lastY - y;
      if (!swiping && dy !== 0 && atEdge(Math.sign(dy))) return; /* at the ends, let the page scroll */
      e.preventDefault(); /* claim the gesture from the first move so the page doesn't start scrolling */
      if (dy === 0) return;
      swiping = true; begin();
      lastY = y;
      move(dy / spacing());
    };
    const onEnd = () => { if (swiping) settle(); swiping = false; };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      window.clearTimeout(idle);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); choose(sel + 1, true); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); choose(sel - 1, true); }
  };

  /* footer deep links: #solution-<id> */
  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(/^#solution-([a-z]+)$/);
      const i = m ? ITEMS.findIndex((it) => it.id === m[1]) : -1;
      if (i < 0) return;
      target.current = i;
      setSel(i);
      section.current?.scrollIntoView({ block: "start" });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const it = ITEMS[sel];

  return (
    <section ref={section} id="solutions" className={t.root} aria-label={SOLUTIONS.eyebrow}>
      <div className={t.water} aria-hidden="true"><span /><span /><span /><span /></div>

      <header className={t.head}>
        <p className={t.eyebrow}>{SOLUTIONS.eyebrow}</p>
        <h2 className={t.title}>{SOLUTIONS.headline}</h2>
      </header>

      <div className={t.layout}>
        <div className={t.side}>
          <div ref={wheel} className={t.wheel} role="tablist" aria-label="Solutions" aria-orientation="vertical" onKeyDown={onKey}>
            {ITEMS.map((m, i) => (
              <button
                key={m.id}
                ref={(el) => { items.current[i] = el; }}
                type="button"
                role="tab"
                id={`tide-tab-${m.id}`}
                aria-selected={sel === i}
                aria-controls="tide-article"
                tabIndex={sel === i ? 0 : -1}
                className={t.item}
                onClick={() => choose(i)}
              >
                <span className={t.itemN}>{String(i + 1).padStart(2, "0")}</span>
                <span className={t.itemLabel}>{m.title}</span>
              </button>
            ))}
          </div>
          <p className={t.hint} aria-hidden="true"><span className={t.hintDesk}>Scroll the wheel to explore</span><span className={t.hintMob}>Swipe the wheel</span></p>
        </div>

        <article id="tide-article" role="tabpanel" aria-labelledby={`tide-tab-${it.id}`} className={t.article} key={it.id}>
          <p className={t.kicker}>Solution {String(sel + 1).padStart(2, "0")}</p>
          <h3 className={t.articleTitle}>{it.title}</h3>
          <p className={t.lead}>{it.body}</p>
          {it.overview.map((p) => <p key={p} className={t.para}>{p}</p>)}

        </article>
      </div>
    </section>
  );
}
