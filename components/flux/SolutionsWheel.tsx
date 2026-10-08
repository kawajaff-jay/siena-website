"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SOLUTIONS } from "@/content/site";
import w from "./wheel.module.css";

export type WheelVariant = "tide" | "dial" | "drum" | "lens" | "arc";
const ITEMS = SOLUTIONS.items;
const N = ITEMS.length;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/**
 * Solutions as a wheel. Scrolling through the section turns the wheel one solution at a time;
 * hovering (or focusing) a solution previews it; clicking scrolls the wheel to it. The description
 * of the current solution is shown separately and changes as the wheel turns.
 */
export function SolutionsWheel({ variant }: { variant: WheelVariant }) {
  const root = useRef<HTMLElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  /* scroll position → continuous wheel position (smoothed), active solution */
  useEffect(() => {
    const el = root.current!, wh = wheel.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pos = 0, raf = 0, last = -1;
    const frame = () => {
      const r = el.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - window.innerHeight));
      const scrollPos = p * (N - 1);
      /* the wheel follows scroll only; hover just highlights (moving it would slide items out from under the cursor) */
      pos = reduce ? scrollPos : pos + (scrollPos - pos) * 0.12;
      wh.style.setProperty("--pos", pos.toFixed(4));
      items.current.forEach((it, i) => {
        if (!it) return;
        const d = i - pos, ad = Math.abs(d);
        it.style.setProperty("--d", d.toFixed(3));
        it.style.setProperty("--ad", ad.toFixed(3));
        it.style.setProperty("--d2", (d * d).toFixed(3));
        it.style.setProperty("--lens", Math.max(0, 1 - ad).toFixed(3));
      });
      const a = Math.round(scrollPos);
      if (a !== last) { last = a; setActive(a); }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* scroll the page so the wheel lands on solution i */
  const goTo = (i: number, smooth = true) => {
    const el = root.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (travel * i) / (N - 1) + 2, behavior: smooth ? "smooth" : "auto" });
  };

  /* footer deep links: #solution-<id> */
  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(/^#solution-([a-z]+)$/);
      const i = m ? ITEMS.findIndex((it) => it.id === m[1]) : -1;
      if (i >= 0) goTo(i, false);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const shown = hover ?? active;
  const it = ITEMS[shown];

  return (
    <section ref={root} id="solutions" className={w.root} data-variant={variant} aria-label={SOLUTIONS.eyebrow}>
      <div className={w.stage}>
        {variant === "tide" && (
          <div className={w.water} aria-hidden="true"><span /><span /><span /><span /></div>
        )}

        <header className={w.head}>
          <p className={w.eyebrow}>{SOLUTIONS.eyebrow}</p>
          <h2 className={w.title}>{SOLUTIONS.headline}</h2>
        </header>

        <div className={w.layout}>
          <div ref={wheel} className={w.wheel} onMouseLeave={() => setHover(null)}>
            {(variant === "dial" || variant === "arc") && <span className={w.ring} aria-hidden="true" />}
            {variant === "lens" && <span className={w.lensFrame} aria-hidden="true" />}
            {variant === "drum" && <span className={w.drumBand} aria-hidden="true" />}
            <ul className={w.list} role="list">
              {ITEMS.map((m, i) => (
                <li key={m.id} className={w.li}>
                  <button
                    ref={(el) => { items.current[i] = el; }}
                    type="button"
                    className={w.item}
                    aria-current={shown === i ? "true" : undefined}
                    aria-controls="wheel-detail"
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    onClick={() => { setHover(null); goTo(i); }}
                    style={{ "--i": i } as CSSProperties}
                  >
                    <span className={w.itemN}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={w.itemLabel}>{m.title}</span>
                  </button>
                </li>
              ))}
            </ul>
            {(variant === "dial" || variant === "arc") && <span className={w.hub} aria-hidden="true" />}
          </div>

          <article id="wheel-detail" className={w.detail} aria-live="polite" key={it.id}>
            <p className={w.detailN}>{String(shown + 1).padStart(2, "0")} <span>/ {String(N).padStart(2, "0")}</span></p>
            <h3 className={w.detailTitle}>{it.title}</h3>
            <p className={w.detailBody}>{it.body}</p>
            <ol className={w.steps} aria-label={SOLUTIONS.drawer.workflow}>
              {it.workflow.map((s, n) => <li key={s} style={{ "--n": n } as CSSProperties}>{s}</li>)}
            </ol>
            <p className={w.result}>{it.result}</p>
          </article>
        </div>

        <div className={w.progress} aria-hidden="true">
          {ITEMS.map((m, i) => <span key={m.id} data-on={i === shown || undefined} />)}
        </div>
        <p className={w.hint} aria-hidden="true">Scroll or hover to explore</p>
      </div>
    </section>
  );
}
