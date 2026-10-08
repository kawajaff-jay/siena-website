"use client";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { SOLUTIONS } from "@/content/site";
import t from "./tide.module.css";

const ITEMS = SOLUTIONS.items;
const N = ITEMS.length;

/**
 * Solutions — "Tide". The wheel stays fixed on the left while the page scrolls; it is independent of
 * scrolling. Click (or arrow keys) chooses a solution and the wheel drifts to it; hover only highlights.
 * The chosen solution's full description is a normal article on the right that you scroll to read.
 */
export function SolutionsTide() {
  const section = useRef<HTMLElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const [sel, setSel] = useState(0);
  const target = useRef(0);
  target.current = sel;

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

  /* choose a solution; if the reader is further down the previous article, bring them to the top of the new one */
  const choose = (i: number, focus = false) => {
    const n = (i + N) % N;
    setSel(n);
    if (focus) items.current[n]?.focus();
    const top = section.current?.getBoundingClientRect().top ?? 0;
    if (top < -40) section.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
      setSel(i);
      section.current?.scrollIntoView({ block: "start" });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const it = ITEMS[sel];
  const next = ITEMS[(sel + 1) % N];

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
          <div className={t.sideFoot}>
            <button type="button" className={t.arrow} onClick={() => choose(sel - 1)} aria-label="Previous solution">↑</button>
            <span className={t.count}>{String(sel + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}</span>
            <button type="button" className={t.arrow} onClick={() => choose(sel + 1)} aria-label="Next solution">↓</button>
          </div>
        </div>

        <article id="tide-article" role="tabpanel" aria-labelledby={`tide-tab-${it.id}`} className={t.article} key={it.id}>
          <p className={t.kicker}>Solution {String(sel + 1).padStart(2, "0")}</p>
          <h3 className={t.articleTitle}>{it.title}</h3>
          <p className={t.lead}>{it.body}</p>
          {it.overview.map((p) => <p key={p} className={t.para}>{p}</p>)}

          <h4 className={t.h4}>{SOLUTIONS.drawer.workflow}</h4>
          <ol className={t.steps}>
            {it.workflow.map((s, n) => <li key={s} style={{ "--n": n } as CSSProperties}>{s}</li>)}
          </ol>

          <div className={t.cols}>
            <div>
              <h4 className={t.h4}>{SOLUTIONS.drawer.connects}</h4>
              <ul className={t.chips}>{it.connects.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
            <div>
              <h4 className={t.h4}>{SOLUTIONS.drawer.uses}</h4>
              <ul className={t.uses}>{it.uses.map((u) => <li key={u}>{u}</li>)}</ul>
            </div>
          </div>

          <div className={t.outcome}>
            <span>{SOLUTIONS.drawer.outcome}</span>
            <p>{it.result}</p>
          </div>

          <div className={t.actions}>
            <a href="#contact" className={t.cta}>Discuss {it.title} with us</a>
            <button type="button" className={t.nextBtn} onClick={() => choose(sel + 1)}>
              Next: {next.title} <span aria-hidden="true">→</span>
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
