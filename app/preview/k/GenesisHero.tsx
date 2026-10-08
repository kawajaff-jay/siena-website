"use client";
import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";
import { LOCKUP, SIENA_BLADE_LOWER, SIENA_BLADE_UPPER, SIENA_S_THREAD } from "@/lib/geometry";
import s from "./k.module.css";

/* Scroll-built hero: data points → neural links → the traced S → the official SIENA logo.
   The trace is the approved guide line from lib/geometry; the mark that remains is always the real asset. */

const N = 84;
const VB = { x: 560, y: 120, w: 800, h: 720 };
const SYMBOL_BOTTOM = LOCKUP.wordmarkTop - 8;

/* deterministic pseudo-random so server and client render the same scatter */
function rand(i: number, k: number) {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
const START = Array.from({ length: N }, (_, i) => ({
  x: VB.x - 160 + rand(i, 1) * (VB.w + 320),
  y: VB.y - 80 + rand(i, 2) * (VB.h + 160),
  r: 1.6 + rand(i, 3) * 2.6,
}));
/* a few long-range links on top of the neighbour chain */
const EXTRA = Array.from({ length: 26 }, (_, i) => [Math.floor(rand(i, 7) * N), Math.floor(rand(i, 8) * N)] as const);

const STAGES = ["Signals", "Connections", "Pattern", "Intelligence"];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function GenesisHero({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const guide = useRef<SVGPathElement>(null);

  useEffect(() => {
    const root = track.current!, el = svg.current!, path = guide.current!;
    const dots = Array.from(el.querySelectorAll<SVGCircleElement>("[data-dot]"));
    const links = Array.from(el.querySelectorAll<SVGLineElement>("[data-link]"));
    const len = path.getTotalLength();
    const target = Array.from({ length: N }, (_, i) => {
      const pt = path.getPointAtLength((i / (N - 1)) * len);
      return { x: pt.x, y: pt.y };
    });
    const pos = START.map((p) => ({ ...p }));
    const linkPairs = [
      ...Array.from({ length: N - 1 }, (_, i) => [i, i + 1] as const),
      ...EXTRA,
    ].slice(0, links.length);
    root.style.setProperty("--len", String(len));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) root.dataset.static = "true";

    let raf = 0, t0 = performance.now();
    const frame = (now: number) => {
      const r = root.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = reduce ? 1 : clamp(-r.top / Math.max(1, total));
      const time = (now - t0) / 1000;
      root.style.setProperty("--p", p.toFixed(4));

      const gather = ease(range(p, 0.06, 0.42));
      for (let i = 0; i < N; i++) {
        const st = START[i], tg = target[i];
        /* idle drift while scattered, settles as the points gather */
        const drift = (1 - gather) * 10;
        const dx = Math.sin(time * 0.6 + i) * drift, dy = Math.cos(time * 0.5 + i * 1.7) * drift;
        pos[i].x = st.x + (tg.x - st.x) * gather + dx;
        pos[i].y = st.y + (tg.y - st.y) * gather + dy;
        dots[i].setAttribute("cx", pos[i].x.toFixed(1));
        dots[i].setAttribute("cy", pos[i].y.toFixed(1));
      }
      linkPairs.forEach(([a, b], k) => {
        const l = links[k];
        l.setAttribute("x1", pos[a].x.toFixed(1)); l.setAttribute("y1", pos[a].y.toFixed(1));
        l.setAttribute("x2", pos[b].x.toFixed(1)); l.setAttribute("y2", pos[b].y.toFixed(1));
      });
      const stage = p < 0.22 ? 0 : p < 0.45 ? 1 : p < 0.68 ? 2 : 3;
      root.dataset.stage = String(stage);
      root.dataset.done = p > 0.86 ? "true" : "false";
      const pct = root.querySelector<HTMLElement>("[data-pct]");
      if (pct) pct.textContent = String(Math.round(range(p, 0, 0.86) * 100)).padStart(2, "0");
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={track} className={s.genesis} style={{ "--p": 0 } as React.CSSProperties} data-stage="0" aria-label="SIENA — intelligence takes shape">
      <div className={s.stage}>
        <div className={s.burst} aria-hidden="true" />

        <svg ref={svg} className={s.mark} viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} aria-hidden="true">
          <defs>
            <linearGradient id="kTrace" x1="835" y1="595" x2="1090" y2="204" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#7fe3d3" />
              <stop offset=".45" stopColor="#3b6cff" />
              <stop offset="1" stopColor="#b38cff" />
            </linearGradient>
            <clipPath id="kSymbolClip"><rect x={LOCKUP.x} y={LOCKUP.y} width={LOCKUP.w} height={SYMBOL_BOTTOM - LOCKUP.y} /></clipPath>
            <clipPath id="kWordClip"><rect className={s.wordClip} x={LOCKUP.x} y={SYMBOL_BOTTOM} width={LOCKUP.w} height={LOCKUP.y + LOCKUP.h - SYMBOL_BOTTOM} /></clipPath>
          </defs>
          <path ref={guide} d={SIENA_S_THREAD} fill="none" stroke="none" />

          <g className={s.links}>
            {Array.from({ length: N - 1 + EXTRA.length }, (_, k) => <line key={k} data-link className={k >= N - 1 ? s.linkFar : undefined} />)}
          </g>
          <g className={s.dots}>
            {START.map((p, i) => <circle key={i} data-dot cx={p.x} cy={p.y} r={p.r} />)}
          </g>

          <path d={SIENA_S_THREAD} className={s.traceGlow} />
          <path d={SIENA_S_THREAD} className={s.trace} />
          <g className={s.blades}>
            <path d={SIENA_BLADE_UPPER} />
            <path d={SIENA_BLADE_LOWER} />
          </g>

          {/* the official SIENA lockup: symbol first, then the wordmark */}
          <image className={s.logoSymbol} href={asset("/brand/siena-lockup.webp")} x={LOCKUP.x} y={LOCKUP.y} width={LOCKUP.w} height={LOCKUP.h} clipPath="url(#kSymbolClip)" preserveAspectRatio="xMidYMid meet" />
          <image className={s.logoWord} href={asset("/brand/siena-lockup.webp")} x={LOCKUP.x} y={LOCKUP.y} width={LOCKUP.w} height={LOCKUP.h} clipPath="url(#kWordClip)" preserveAspectRatio="xMidYMid meet" />
        </svg>

        <div className={s.intro}>
          <p className={s.pill}>SIENA — AI Solutions &amp; Systems</p>
          <h1 className={s.introTitle}>Every business generates signals.<br /><em>Intelligence connects them.</em></h1>
          <p className={s.cue}><span aria-hidden="true" /> Scroll to watch it take shape</p>
        </div>

        <ol className={s.hud} aria-hidden="true">
          {STAGES.map((t, i) => <li key={t} data-i={i}><span>0{i + 1}</span>{t}</li>)}
        </ol>
        <p className={s.meter} aria-hidden="true">
          <span>Assembling intelligence <b data-pct>00</b>%</span>
          <span className={s.meterBar}><i /></span>
        </p>

        <div className={s.outro}>{children}</div>
      </div>
    </section>
  );
}
