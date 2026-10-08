"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { SOLUTIONS } from "@/content/site";

/** Solutions explorer: plays through the modules on its own until the visitor picks one. */
export function Explorer({ s }: { s: Record<string, string> }) {
  const items = SOLUTIONS.items;
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % items.length), 6500);
    return () => window.clearTimeout(t);
  }, [auto, i, items.length]);

  const it = items[i];
  const pick = (n: number) => { setAuto(false); setI(n); };

  return (
    <div className={s.explorer}>
      <div className={s.tabs} role="tablist" aria-label="Solutions">
        {items.map((m, n) => (
          <button
            key={m.id}
            role="tab"
            type="button"
            id={`tab-${m.id}`}
            aria-selected={n === i}
            aria-controls="solution-panel"
            className={s.tab}
            onClick={() => pick(n)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); pick((n + 1) % items.length); }
              if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); pick((n - 1 + items.length) % items.length); }
            }}
            tabIndex={n === i ? 0 : -1}
          >
            <span className={s.tabN}>{String(n + 1).padStart(2, "0")}</span>
            <span className={s.tabTitle}>{m.title}</span>
            {n === i && auto && <span className={s.tabTimer} aria-hidden="true" />}
          </button>
        ))}
      </div>
      <div className={s.view} role="tabpanel" id="solution-panel" aria-labelledby={`tab-${it.id}`} key={it.id} data-spot="">
        <p className={s.viewKicker}>{SOLUTIONS.drawer.workflow}</p>
        <h3 className={s.viewTitle}>{it.title}</h3>
        <p className={s.viewBody}>{it.body}</p>
        <ol className={s.viewSteps}>
          {it.workflow.map((w, n) => <li key={w} style={{ "--d": n } as CSSProperties}>{w}</li>)}
        </ol>
        <div className={s.viewFoot}>
          <ul className={s.viewConnects} aria-label={SOLUTIONS.drawer.connects}>
            {it.connects.map((c) => <li key={c}>{c}</li>)}
          </ul>
          <p className={s.viewResult}>{it.result}</p>
        </div>
      </div>
    </div>
  );
}
