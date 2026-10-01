"use client";
/**
 * SolutionDrawer — the detail panel for a Solutions module.
 * Desktop: slides in from the right. Phones: a bottom sheet (swipe down on its top to close).
 * Closes with ×, ESC, the backdrop, or the browser Back button. Focus stays inside while open
 * and returns to the module that opened it. Always mounted (hidden when closed) so the modules'
 * aria-controls points at a real element.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SOLUTIONS } from "@/content/site";
import { SolutionVisual } from "./SolutionVisual";

const ITEMS = SOLUTIONS.items;
const T = SOLUTIONS.drawer;
const FADE_MS = 380;
type Phase = "closed" | "open" | "closing";

export function SolutionDrawer({
  index,
  onClose,
  onNavigate,
}: {
  index: number | null;
  onClose: (thenGoTo?: string) => void;
  onNavigate: (i: number) => void;
}) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [shown, setShown] = useState<number>(0); // the module on display (kept while closing)
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const ownsHistory = useRef(false);
  const ignorePop = useRef(false);
  const pending = useRef<string | undefined>(undefined);
  const phaseRef = useRef<Phase>("closed");
  phaseRef.current = phase;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // open / switch module
  useEffect(() => {
    if (index === null) return;
    setShown(index);
    if (phaseRef.current !== "open") {
      setPhase("open");
      history.pushState({ sienaSolution: true }, "", `#solution-${ITEMS[index].id}`);
      ownsHistory.current = true;
    } else {
      history.replaceState({ sienaSolution: true }, "", `#solution-${ITEMS[index].id}`);
      panelRef.current?.querySelector(".sol-drawer-scroll")?.scrollTo({ top: 0 });
    }
  }, [index]);

  /** start closing; fromHistory = the browser already went back */
  const requestClose = useCallback((thenGoTo?: string, fromHistory = false) => {
    if (phaseRef.current !== "open") return;
    pending.current = thenGoTo;
    if (!fromHistory && ownsHistory.current) { ignorePop.current = true; history.back(); }
    ownsHistory.current = false;
    setPhase("closing");
  }, []);

  useEffect(() => {
    if (phase !== "closing") return;
    const t = window.setTimeout(() => {
      setPhase("closed");
      document.documentElement.classList.remove("drawer-open");
      onClose(pending.current);
    }, FADE_MS);
    return () => window.clearTimeout(t);
  }, [phase, onClose]);

  // Back closes the drawer (and stays on the page)
  useEffect(() => {
    const onPop = () => {
      if (ignorePop.current) { ignorePop.current = false; return; }
      if (phaseRef.current === "open") requestClose(undefined, true);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [requestClose]);

  // while open: lock the page, ESC, arrow keys between modules, focus kept inside
  useEffect(() => {
    if (phase !== "open") return;
    document.documentElement.classList.add("drawer-open");
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); requestClose(); return; }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      const inside = panelRef.current.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !inside)) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, requestClose]);

  // iOS Safari: touches on the backdrop or the sheet's frame must never scroll the page behind
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || phase === "closed") return;
    const block = (e: TouchEvent) => {
      if (!(e.target as Element).closest(".sol-drawer-scroll")) e.preventDefault();
    };
    el.addEventListener("touchmove", block, { passive: false });
    return () => el.removeEventListener("touchmove", block);
  }, [phase]);

  // phones: swipe the sheet down by its top edge to close
  const drag = useRef<{ y0: number; dy: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { drag.current = { y0: e.touches[0].clientY, dy: 0 }; };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!drag.current || !panelRef.current) return;
    drag.current.dy = Math.max(0, e.touches[0].clientY - drag.current.y0);
    panelRef.current.style.transform = `translateY(${drag.current.dy}px)`;
  };
  const onTouchEnd = () => {
    const d = drag.current;
    drag.current = null;
    if (!panelRef.current) return;
    panelRef.current.style.transform = "";
    if (d && d.dy > 90) requestClose();
  };

  const s = ITEMS[shown];
  const prev = (shown + ITEMS.length - 1) % ITEMS.length;
  const next = (shown + 1) % ITEMS.length;

  if (!mounted) return null;
  // rendered at the end of <body> so it sits above the site header and outside the section's layers
  return createPortal(
    <div id="solution-drawer" ref={rootRef} className="sol-drawer" data-phase={phase} hidden={phase === "closed"}>
      <div className="sol-drawer-backdrop" onClick={() => requestClose()} aria-hidden="true" />
      <div ref={panelRef} className="sol-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="sol-drawer-title">
        <div className="sol-drawer-head" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <span className="sol-drawer-grab" aria-hidden="true" />
          <div className="sol-drawer-titles">
            <span className="sol-drawer-index" aria-hidden="true">{String(shown + 1).padStart(2, "0")}</span>
            <h2 id="sol-drawer-title">{s.title}</h2>
          </div>
          <button type="button" className="sol-drawer-close" ref={closeBtn} onClick={() => requestClose()} aria-label={`Close ${s.title}`}>
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="sol-drawer-scroll" key={s.id}>
          <div className="sol-drawer-visual is-live">
            <SolutionVisual kind={s.visual} />
          </div>
          <p className="sol-drawer-lead">{s.body}</p>

          <section className="sol-drawer-block">
            <h3>{T.connects}</h3>
            <ul className="sol-drawer-chips">
              {s.connects.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </section>

          <section className="sol-drawer-block">
            <h3>{T.workflow}</h3>
            <ol className="sol-flow">
              {s.workflow.map((step, k) => (
                <li key={step} style={{ ["--k" as string]: k } as React.CSSProperties}>
                  <span className="sol-flow-dot" aria-hidden="true" />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="sol-drawer-block">
            <h3>{T.uses}</h3>
            <ul className="sol-drawer-uses">
              {s.uses.map((u) => <li key={u}>{u}</li>)}
            </ul>
          </section>

          <section className="sol-drawer-block sol-drawer-outcome">
            <h3>{T.outcome}</h3>
            <p>{s.result}</p>
          </section>

          <a href="#contact" className="btn btn--primary sol-drawer-cta" onClick={(e) => { e.preventDefault(); requestClose("#contact"); }}>
            {T.cta}
          </a>
        </div>

        <nav className="sol-drawer-nav" aria-label="Other solutions">
          <button type="button" onClick={() => onNavigate(prev)}>
            <span aria-hidden="true">←</span> {ITEMS[prev].title}
          </button>
          <button type="button" onClick={() => onNavigate(next)}>
            {ITEMS[next].title} <span aria-hidden="true">→</span>
          </button>
        </nav>
      </div>
    </div>,
    document.body,
  );
}
