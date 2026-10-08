"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { SOLUTIONS } from "@/content/site";
import { asset } from "@/lib/asset";
import { LOCKUP, SIENA_BLADE_LOWER, SIENA_BLADE_UPPER, SIENA_S_THREAD } from "@/lib/geometry";
import g from "./genesis.module.css";

/**
 * Interactive Genesis hero (shared by previews L, M, N).
 * Scroll builds the SIENA symbol from a live particle network; the cursor pushes the network around,
 * clicks send pulses through it, and once formed the eight modules orbit the official logo: hover one
 * to stream data into SIENA, click it to run its workflow. The trace is the approved guide line from
 * lib/geometry; the mark that remains on screen is always the official asset.
 */

export type GenesisVariant = "flux" | "lumiere" | "noir";
export type GenesisPalette = {
  dots: string[];
  link: string;
  linkAlpha: number;
  pulse: string;
  flow: string;
  trace: [string, string, string];
};

const VB = { x: 560, y: 120, w: 800, h: 720 };
const S_CENTER = { x: 956, y: 400 };
const SYMBOL_BOTTOM = LOCKUP.wordmarkTop - 8;
const ITEMS = SOLUTIONS.items;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Part = { tx: number; ty: number; sx: number; sy: number; d: number; r: number; c: string; ph: number; ox: number; oy: number; x: number; y: number; b: number };
type Pulse = { x: number; y: number; t0: number };
type Flow = { x0: number; y0: number; t0: number; dur: number; bend: number };

export function Genesis({
  variant, palette, stages, intro, outro, backdrop, wordmarkDark = false,
}: {
  variant: GenesisVariant;
  palette: GenesisPalette;
  stages: [string, string, string, string];
  intro: ReactNode;
  outro: ReactNode;
  backdrop?: ReactNode;
  wordmarkDark?: boolean;
}) {
  const track = useRef<HTMLElement>(null);
  const stageEl = useRef<HTMLDivElement>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const cursorEl = useRef<HTMLDivElement>(null);
  const thread = useRef<SVGPathElement>(null);
  const upper = useRef<SVGPathElement>(null);
  const lower = useRef<SVGPathElement>(null);
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const hoverRef = useRef<number | null>(null);
  const openRef = useRef<number | null>(null);
  const pulseRef = useRef<Pulse[]>([]);
  const mouse = useRef({ x: 0, y: 0, in: false });

  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  hoverRef.current = hover;
  openRef.current = open;

  useEffect(() => {
    const root = track.current!, stage = stageEl.current!, canvas = canvasEl.current!, markBox = box.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) root.dataset.static = "true";

    /* targets: points along the traced S and the outline of both blades */
    const N = window.innerWidth < 700 ? 120 : 190;
    const sample = (path: SVGPathElement, n: number) => {
      const L = path.getTotalLength();
      return Array.from({ length: n }, (_, i) => path.getPointAtLength(((i + Math.random() * 0.6) / n) * L));
    };
    const nT = Math.round(N * 0.4), nU = Math.round(N * 0.3);
    const targets = [...sample(thread.current!, nT), ...sample(upper.current!, nU), ...sample(lower.current!, N - nT - nU)];
    const parts: Part[] = targets.map((t, i) => ({
      tx: t.x, ty: t.y, sx: Math.random(), sy: Math.random(), d: Math.random(), r: 0.9 + Math.random() * 1.9,
      c: palette.dots[i % palette.dots.length], ph: Math.random() * 6.28, ox: 0, oy: 0, x: 0, y: 0, b: 0,
    }));
    root.style.setProperty("--len", String(thread.current!.getTotalLength()));

    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = stage.clientWidth; H = stage.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const flows: Flow[] = [];
    const tilt = { x: 0, y: 0 };
    let charge = 0, lastSpawn = 0, orbit = 0, lastT = performance.now(), raf = 0;
    const pct = root.querySelector<HTMLElement>("[data-pct]");
    const coords = root.querySelector<HTMLElement>("[data-coords]");

    const frame = (now: number) => {
      const dt = Math.min(50, now - lastT); lastT = now;
      const time = now / 1000;
      const r = root.getBoundingClientRect();
      const p = reduce ? 1 : clamp(-r.top / Math.max(1, r.height - window.innerHeight));
      root.style.setProperty("--p", p.toFixed(4));
      root.dataset.stage = String(p < 0.2 ? 0 : p < 0.42 ? 1 : p < 0.66 ? 2 : 3);
      root.dataset.done = p > 0.88 ? "true" : "false";
      if (pct) pct.textContent = String(Math.round(range(p, 0, 0.86) * 100)).padStart(2, "0");

      /* layout of the mark: centred while building, then moves aside for the modules + copy */
      const desktop = W >= 900;
      const fin = reduce ? 1 : ease(range(p, 0.84, 0.97));
      root.style.setProperty("--fin", fin.toFixed(3));
      const Hb = Math.min(H * 0.8, W * 0.92 * 0.9), Wb = Hb / 0.9;
      const fx = desktop ? W * 0.66 : W / 2, fy = desktop ? H * 0.54 : H * 0.29, fs = desktop ? 0.7 : 0.5;
      const cx = W / 2 + (fx - W / 2) * fin, cy = H / 2 + (fy - H / 2) * fin, sc = 1 + (fs - 1) * fin;
      const k = (Wb * sc) / VB.w;
      const map = (vx: number, vy: number) => [cx + (vx - VB.x - VB.w / 2) * k, cy + (vy - VB.y - VB.h / 2) * k] as const;

      /* logo tilts toward the cursor once formed */
      const want = mouse.current.in && p > 0.8 && !reduce;
      tilt.x += ((want ? (mouse.current.y - cy) / H : 0) * -16 - tilt.x) * 0.08;
      tilt.y += ((want ? (mouse.current.x - cx) / W : 0) * 22 - tilt.y) * 0.08;
      markBox.style.width = `${Wb}px`; markBox.style.height = `${Hb}px`;
      markBox.style.transform = `translate(${cx - Wb / 2}px, ${cy - Hb / 2}px) scale(${sc}) perspective(1400px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg)`;

      /* modules orbit the mark (desktop) */
      const [scx, scy] = map(S_CENTER.x, S_CENTER.y);
      const paused = hoverRef.current !== null || openRef.current !== null;
      /* an arc over and around the symbol (the wordmark below stays clear); it sways until a module is in use */
      if (!paused && !reduce) orbit += dt;
      const sway = Math.sin(orbit / 4000) * 7;
      const chipPos: { x: number; y: number }[] = [];
      chips.current.forEach((el, i) => {
        if (!el) return;
        const a = ((165 + i * 30 + sway) * Math.PI) / 180;
        const x = scx + Math.cos(a) * Wb * sc * 0.62, y = scy + Math.sin(a) * Hb * sc * 0.5;
        chipPos[i] = { x, y };
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${0.6 + 0.4 * fin})`;
      });

      /* data streams from the hovered / open module into SIENA */
      const src = openRef.current ?? hoverRef.current;
      const streamFrom = src !== null && desktop ? chipPos[src] : src !== null ? { x: scx, y: H * 0.98 } : null;
      if (streamFrom && fin > 0.5 && now - lastSpawn > 70 && !reduce) {
        flows.push({ x0: streamFrom.x, y0: streamFrom.y, t0: now, dur: 700 + Math.random() * 400, bend: (Math.random() - 0.5) * 140 });
        lastSpawn = now;
      }
      charge *= 0.94;
      root.style.setProperty("--charge", charge.toFixed(3));

      /* ── canvas ── */
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const pulses = pulseRef.current.filter((q) => now - q.t0 < 2200);
      pulseRef.current = pulses;
      const m = mouse.current;
      const R = variant === "lumiere" ? 170 : 140;
      const residual = range(p, 0.72, 0.86);
      const dotAlpha = 1 - 0.68 * residual;

      for (const pt of parts) {
        const gi = reduce ? 1 : ease(range(p, 0.05 + pt.d * 0.14, 0.3 + pt.d * 0.14));
        const [tx, ty] = map(pt.tx, pt.ty);
        const sx = pt.sx * W, sy = pt.sy * H;
        const drift = (1 - gi) * 16 + residual * 2.5;
        let bx = sx + (tx - sx) * gi + Math.sin(time * 0.7 + pt.ph) * drift;
        let by = sy + (ty - sy) * gi + Math.cos(time * 0.55 + pt.ph * 1.3) * drift;
        let dx = 0, dy = 0;
        if (m.in && !reduce) {
          const vx = bx - m.x, vy = by - m.y, dist = Math.hypot(vx, vy);
          if (dist < R && dist > 0.1) {
            const f = (1 - dist / R) ** 2;
            if (variant === "lumiere") { dx = -vx * f * 0.32; dy = -vy * f * 0.32; }
            else { dx = (vx / dist) * f * 70; dy = (vy / dist) * f * 70; }
          }
        }
        pt.ox += (dx - pt.ox) * 0.1; pt.oy += (dy - pt.oy) * 0.1;
        pt.x = bx + pt.ox; pt.y = by + pt.oy;
        let boost = 0;
        for (const q of pulses) {
          const age = Math.max(0, now - q.t0), rad = age * 0.75, life = 1 - age / 2200;
          const off = Math.hypot(pt.x - q.x, pt.y - q.y) - rad;
          boost = Math.max(boost, Math.exp(-(off * off) / 900) * life);
        }
        pt.b = Math.max(boost, charge * 0.6 * residual);
      }

      /* neural links between nearby points */
      const linkWin = range(p, 0.14, 0.3) * (1 - range(p, 0.7, 0.82));
      const thr = (desktop ? 74 : 56) * Math.max(0.75, sc);
      const torch = (x: number, y: number) =>
        variant !== "noir" || p > 0.82 ? 1 : m.in ? Math.max(0.06, 1 - Math.hypot(x - m.x, y - m.y) / 300) : 0.22;
      ctx.lineWidth = variant === "lumiere" ? 0.6 : 0.8;
      ctx.strokeStyle = palette.link;
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j];
          const ddx = a.x - b.x, ddy = a.y - b.y;
          if (ddx > thr || ddx < -thr || ddy > thr || ddy < -thr) continue;
          const dist = Math.hypot(ddx, ddy);
          if (dist > thr) continue;
          const alpha = (1 - dist / thr) * (linkWin * palette.linkAlpha + residual * 0.1 + Math.max(a.b, b.b) * 0.6) * torch((a.x + b.x) / 2, (a.y + b.y) / 2);
          if (alpha < 0.01) continue;
          ctx.globalAlpha = Math.min(1, alpha);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      for (const pt of parts) {
        const tw = residual > 0 ? 0.6 + 0.4 * Math.sin(time * 2 + pt.ph * 3) : 1;
        ctx.globalAlpha = Math.min(1, dotAlpha * tw * torch(pt.x, pt.y) + pt.b * 0.9);
        ctx.fillStyle = pt.c;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r * (1 + pt.b * 1.6), 0, 6.283); ctx.fill();
        if (pt.b > 0.15) {
          ctx.globalAlpha = pt.b * 0.25;
          ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r * 6, 0, 6.283); ctx.fill();
        }
      }
      /* pulse rings */
      ctx.strokeStyle = palette.pulse;
      for (const q of pulses) {
        const t = Math.max(0, now - q.t0), life = 1 - t / 2200;
        ctx.globalAlpha = life * 0.5; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(q.x, q.y, t * 0.75, 0, 6.283); ctx.stroke();
        ctx.globalAlpha = life * 0.2; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(q.x, q.y, Math.max(0, t * 0.75 - 40), 0, 6.283); ctx.stroke();
      }
      /* data streams */
      ctx.fillStyle = palette.flow; ctx.strokeStyle = palette.flow;
      for (let i = flows.length - 1; i >= 0; i--) {
        const f = flows[i], t = (now - f.t0) / f.dur;
        if (t >= 1) { flows.splice(i, 1); charge = Math.min(1, charge + 0.12); continue; }
        const mx = (f.x0 + scx) / 2 + f.bend, my = (f.y0 + scy) / 2 - Math.abs(f.bend) * 0.4;
        const at = (u: number) => [(1 - u) ** 2 * f.x0 + 2 * (1 - u) * u * mx + u * u * scx, (1 - u) ** 2 * f.y0 + 2 * (1 - u) * u * my + u * u * scy];
        const e = ease(t), [x, y] = at(e), [px, py] = at(Math.max(0, e - 0.08));
        ctx.globalAlpha = 0.9 * (1 - t * 0.3); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* cursor */
      if (cursorEl.current) {
        cursorEl.current.style.transform = `translate(${m.x}px, ${m.y}px)`;
        cursorEl.current.style.opacity = m.in && !reduce ? "1" : "0";
        if (coords && m.in) coords.textContent = `X ${(m.x / W).toFixed(3)}  Y ${(m.y / H).toFixed(3)}`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [palette, variant]);

  const local = (e: React.PointerEvent) => {
    const rect = stageEl.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <section ref={track} className={g.root} data-variant={variant} data-stage="0" style={{ "--p": 0, "--fin": 0 } as CSSProperties} aria-label="SIENA — intelligence takes shape">
      <div
        ref={stageEl}
        className={g.stage}
        onPointerMove={(e) => { const l = local(e); mouse.current = { ...l, in: true }; }}
        onPointerLeave={() => { mouse.current.in = false; }}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button, a")) return;
          const l = local(e);
          pulseRef.current = [...pulseRef.current.slice(-5), { ...l, t0: performance.now() }];
        }}
      >
        {backdrop}
        <canvas ref={canvasEl} className={g.canvas} aria-hidden="true" />

        <div ref={box} className={g.markBox} aria-hidden="true">
          <svg className={g.mark} viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}>
            <defs>
              <linearGradient id={`gTrace-${variant}`} x1="835" y1="595" x2="1090" y2="204" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor={palette.trace[0]} />
                <stop offset=".5" stopColor={palette.trace[1]} />
                <stop offset="1" stopColor={palette.trace[2]} />
              </linearGradient>
              <clipPath id={`gSym-${variant}`}><rect x={LOCKUP.x} y={LOCKUP.y} width={LOCKUP.w} height={SYMBOL_BOTTOM - LOCKUP.y} /></clipPath>
              <clipPath id={`gWord-${variant}`}><rect x={LOCKUP.x} y={SYMBOL_BOTTOM} width={LOCKUP.w} height={LOCKUP.y + LOCKUP.h - SYMBOL_BOTTOM} /></clipPath>
            </defs>
            <path ref={thread} d={SIENA_S_THREAD} fill="none" stroke="none" />
            <path ref={upper} d={SIENA_BLADE_UPPER} fill="none" stroke="none" />
            <path ref={lower} d={SIENA_BLADE_LOWER} fill="none" stroke="none" />
            <path d={SIENA_S_THREAD} className={g.traceGlow} stroke={`url(#gTrace-${variant})`} />
            <path d={SIENA_S_THREAD} className={g.trace} stroke={`url(#gTrace-${variant})`} />
            <g className={g.blades} fill={`url(#gTrace-${variant})`}>
              <path d={SIENA_BLADE_UPPER} />
              <path d={SIENA_BLADE_LOWER} />
            </g>
            <image className={g.logoSymbol} href={asset("/brand/siena-lockup.webp")} x={LOCKUP.x} y={LOCKUP.y} width={LOCKUP.w} height={LOCKUP.h} clipPath={`url(#gSym-${variant})`} preserveAspectRatio="xMidYMid meet" />
            <image className={`${g.logoWord} ${wordmarkDark ? g.wordDark : ""}`} href={asset("/brand/siena-lockup.webp")} x={LOCKUP.x} y={LOCKUP.y} width={LOCKUP.w} height={LOCKUP.h} clipPath={`url(#gWord-${variant})`} preserveAspectRatio="xMidYMid meet" />
          </svg>
        </div>

        <div ref={cursorEl} className={g.cursor} aria-hidden="true">
          <span className={g.cursorRing} />
          <span className={g.cursorCoords} data-coords />
        </div>

        <div className={g.intro}>{intro}</div>

        <ol className={g.hud} aria-hidden="true">
          {stages.map((t, i) => <li key={t} data-i={i}><span>0{i + 1}</span>{t}</li>)}
        </ol>
        <p className={g.meter} aria-hidden="true">
          <span>Assembling intelligence <b data-pct>00</b>%</span>
          <span className={g.meterBar}><i /></span>
        </p>
        <p className={g.hint} aria-hidden="true">Move to disturb the network · click to send a pulse</p>

        <div className={g.orbit}>
          {ITEMS.map((it, i) => (
            <button
              key={it.id}
              ref={(el) => { chips.current[i] = el; }}
              type="button"
              className={g.chip}
              aria-pressed={open === i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className={g.chipDot} />{it.title}
            </button>
          ))}
        </div>

        <div className={g.outro}>
          {open === null ? (
            <>
              {outro}
              <p className={g.outroHint}><span className={g.hintDesk}>Select a module orbiting SIENA to watch it run.</span><span className={g.hintMob}>Tap a module to watch it run.</span></p>
              <div className={g.chipRow}>
                {ITEMS.map((it, i) => (
                  <button key={it.id} type="button" className={g.chip} onClick={() => setOpen(i)}>
                    <span className={g.chipDot} />{it.title}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <RunPanel index={open} onClose={() => setOpen(null)} onNext={() => setOpen((open + 1) % ITEMS.length)} />
          )}
        </div>
      </div>
    </section>
  );
}

function RunPanel({ index, onClose, onNext }: { index: number; onClose: () => void; onNext: () => void }) {
  const it = ITEMS[index];
  return (
    <div className={g.panel} role="region" aria-live="polite" aria-label={`${it.title} workflow`} key={it.id}>
      <p className={g.panelStatus}><span className={g.live} /> Running · {it.title.toLowerCase()} workflow</p>
      <h2 className={g.panelTitle}>{it.title}</h2>
      <p className={g.panelBody}>{it.body}</p>
      <ol className={g.steps}>
        {it.workflow.map((w, i) => <li key={w} style={{ "--d": i } as CSSProperties}><span className={g.tick} />{w}</li>)}
      </ol>
      <p className={g.panelResult} style={{ "--d": it.workflow.length } as CSSProperties}>{it.result}</p>
      <div className={g.panelActions}>
        <button type="button" className={g.panelBtn} onClick={onClose}>← Back</button>
        <button type="button" className={g.panelBtn} onClick={onNext}>Next module →</button>
      </div>
    </div>
  );
}
