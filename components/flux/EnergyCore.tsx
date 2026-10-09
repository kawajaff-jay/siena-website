"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { asset } from "@/lib/asset";
import e from "./energy.module.css";

export type EnergyVariant = "reactor" | "storm" | "resonance" | "field";

const CYAN = "51,225,255", PINK = "255,79,216", BLUE = "122,162,255", WHITE = "230,247,255";
type P = { x: number; y: number };

const LABEL: Record<EnergyVariant, string> = {
  reactor: "SIENA core · reactor",
  storm: "SIENA core · plasma",
  resonance: "SIENA core · resonance",
  field: "SIENA core · field",
};

/** jagged lightning path between two points (midpoint displacement) */
function bolt(a: P, b: P, depth: number, out: P[]) {
  if (depth === 0) { out.push(b); return; }
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const m = { x: (a.x + b.x) / 2 + (Math.random() - 0.5) * len * 0.32, y: (a.y + b.y) / 2 + (Math.random() - 0.5) * len * 0.32 };
  bolt(a, m, depth - 1, out);
  bolt(m, b, depth - 1, out);
}

/**
 * The SIENA symbol, charged with energy. The mark itself is always the official asset (with the pink tail laid over it,
 * as in the header); everything moving around it is drawn on a canvas behind. Move the cursor closer to charge it,
 * click to send a surge. Four styles: reactor, storm, resonance, field.
 */
export function EnergyCore({ variant }: { variant: EnergyVariant }) {
  const root = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const skinCv = useRef<HTMLCanvasElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current!, c = cv.current!, sk = skinCv.current!, co = core.current!, ro = readout.current!;
    const ctx = c.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, size = 0;
    let inside: P[] = [], edge: P[] = [];
    let cu = 0.42, cvn = 0.49; /* the symbol's centre of mass, as a fraction of the image box */
    let raf = 0, visible = false, last = performance.now(), t = 0, readT = 0;
    let mx = -1e5, my = -1e5, prox = 0, surge = 0, kick = 0, E = 0.6;

    /* canvas position of a point on the symbol (image-box fractions) */
    const at = (p: P): P => ({ x: cx + (p.x - cu) * size, y: cy + (p.y - cvn) * size });
    const rnd = <T,>(a: T[]) => a[(Math.random() * a.length) | 0];
    const isTail = (p: P) => p.x + (1 - p.y) < 0.62;

    const layout = () => {
      const r = el.getBoundingClientRect();
      W = r.width; H = r.height;
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      c.width = sk.width = Math.round(W * dpr); c.height = sk.height = Math.round(H * dpr);
      cx = W / 2; cy = H / 2;
      size = Math.min(W * 0.46, H * 0.6, 290);
      Object.assign(co.style, { width: `${size}px`, height: `${size}px`, left: `${cx - cu * size}px`, top: `${cy - cvn * size}px` });
      init();
    };

    /* ---------- per-variant state ---------- */
    type Ring = { r: number; col: string; w: number };
    type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; col: string };
    type Arc = { pts: P[]; life: number; max: number; col: string };
    type Mote = { a: number; r: number; w: number; s: number };
    type Bound = { p: P; ph: number; f: number; col: string };
    type Free = { a: number; r: number; v: number; px: number; py: number; col: string };
    let rings: Ring[] = [], sparks: Spark[] = [], arcs: Arc[] = [], motes: Mote[] = [], bound: Bound[] = [], free: Free[] = [];
    let ringAcc = 0, pulses: number[] = [], burst = 0;

    const spawnFree = (f: Free, far = true) => {
      f.a = Math.random() * Math.PI * 2;
      f.r = far ? Math.max(W, H) * (0.45 + Math.random() * 0.2) : size * (0.6 + Math.random() * 1.6);
      f.v = 0.6 + Math.random() * 0.8;
      f.px = NaN;
      f.col = Math.random() < 0.18 ? PINK : Math.random() < 0.5 ? CYAN : Math.random() < 0.5 ? BLUE : WHITE;
    };

    const init = () => {
      rings = []; sparks = []; arcs = []; pulses = [];
      motes = Array.from({ length: 70 }, () => ({ a: Math.random() * 6.283, r: 0.55 + Math.random() * 0.4, w: (Math.random() < 0.5 ? -1 : 1) * (0.0004 + Math.random() * 0.0009), s: 0.6 + Math.random() * 1.6 }));
      bound = inside.length
        ? Array.from({ length: 520 }, () => { const p = rnd(inside); return { p, ph: Math.random() * 6.283, f: 0.004 + Math.random() * 0.01, col: isTail(p) ? PINK : Math.random() < 0.6 ? WHITE : CYAN }; })
        : [];
      free = Array.from({ length: W < 600 ? 150 : 280 }, () => { const f = {} as Free; spawnFree(f, false); return f; });
    };

    /* sample the symbol's own pixels (no redrawing: points are only used to place the energy) */
    const img = new Image();
    img.src = asset("/brand/siena-symbol-160.webp");
    img.onload = () => {
      const S = 160, oc = document.createElement("canvas");
      oc.width = oc.height = S;
      const ox = oc.getContext("2d")!;
      ox.drawImage(img, 0, 0, S, S);
      const d = ox.getImageData(0, 0, S, S).data;
      const A = (x: number, y: number) => (x < 0 || y < 0 || x >= S || y >= S ? 0 : d[(y * S + x) * 4 + 3]);
      let sx = 0, sy = 0;
      inside = []; edge = [];
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        if (A(x, y) < 150) continue;
        const p = { x: (x + 0.5) / S, y: (y + 0.5) / S };
        inside.push(p); sx += p.x; sy += p.y;
        if (A(x + 2, y) < 150 || A(x - 2, y) < 150 || A(x, y + 2) < 150 || A(x, y - 2) < 150) edge.push(p);
      }
      if (inside.length) { cu = sx / inside.length; cvn = sy / inside.length; }
      layout();
      if (reduce) frame(performance.now());
    };

    /* ---------- drawing helpers ---------- */
    const glowLine = (pts: P[], col: string, a: number, w = 1.4) => {
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.strokeStyle = `rgba(${col},${(a * 0.18).toFixed(3)})`; ctx.lineWidth = w * 6; ctx.stroke();
      ctx.strokeStyle = `rgba(${col},${a.toFixed(3)})`; ctx.lineWidth = w; ctx.stroke();
    };
    const circle = (r: number, col: string, a: number, w = 1) => {
      ctx.beginPath(); ctx.arc(cx, cy, Math.max(0, r), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${col},${a.toFixed(3)})`; ctx.lineWidth = w; ctx.stroke();
    };

    /* ---------- 1 · Reactor: shockwaves, a spectrum ring and sparks thrown off the edge ---------- */
    const reactor = (dt: number) => {
      ringAcc += dt * (0.6 + E);
      if (ringAcc > 1100) { ringAcc = 0; rings.push({ r: size * 0.42, col: rings.length % 3 === 2 ? PINK : CYAN, w: 1.4 }); }
      const maxR = Math.max(W, H) * 0.62;
      rings = rings.filter((g) => (g.r += dt * (0.07 + 0.05 * E)) < maxR);
      rings.forEach((g) => circle(g.r, g.col, (1 - g.r / maxR) * 0.55, g.w));

      /* spectrum ring */
      const R0 = size * 0.8, n = 120;
      ctx.lineWidth = 2;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + t * 0.00015;
        const v = (Math.sin(i * 1.7 + t * 0.005) + Math.sin(i * 0.43 - t * 0.0071) + 2) / 4;
        const len = 3 + v * 22 * E;
        const cs = Math.cos(a), sn = Math.sin(a);
        ctx.strokeStyle = `rgba(${i % 15 === 0 ? PINK : CYAN},${(0.25 + v * 0.5).toFixed(3)})`;
        ctx.beginPath(); ctx.moveTo(cx + cs * R0, cy + sn * R0); ctx.lineTo(cx + cs * (R0 + len), cy + sn * (R0 + len)); ctx.stroke();
      }
      ctx.setLineDash([2, 10]); ctx.lineDashOffset = -t * 0.02;
      circle(size * 0.68, BLUE, 0.5);
      ctx.setLineDash([]);

      /* sparks */
      if (edge.length) for (let k = 0; k < E * 2.4 * (dt / 16); k++) {
        const p = at(rnd(edge)), dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy) || 1, sp = 0.08 + Math.random() * 0.3 * E;
        sparks.push({ x: p.x, y: p.y, vx: (dx / d) * sp + (Math.random() - 0.5) * 0.06, vy: (dy / d) * sp + (Math.random() - 0.5) * 0.06, life: 0, max: 300 + Math.random() * 600, col: Math.random() < 0.25 ? PINK : Math.random() < 0.5 ? WHITE : CYAN });
      }
      if (sparks.length > 500) sparks.splice(0, sparks.length - 500);
      sparks = sparks.filter((s) => (s.life += dt) < s.max);
      ctx.lineWidth = 1.3;
      sparks.forEach((s) => {
        s.x += s.vx * dt; s.y += s.vy * dt;
        ctx.strokeStyle = `rgba(${s.col},${(1 - s.life / s.max).toFixed(3)})`;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 40, s.y - s.vy * 40); ctx.stroke();
      });
    };

    /* ---------- 2 · Storm: lightning from the S to a containment ring (and to your cursor) ---------- */
    const storm = (dt: number) => {
      const R = size * 0.9;
      circle(R, CYAN, 0.25);
      circle(R + 6, CYAN, 0.08, 4);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 - t * 0.0002;
        ctx.fillStyle = `rgba(${i % 4 === 0 ? PINK : CYAN},0.8)`;
        ctx.fillRect(cx + Math.cos(a) * R - 2, cy + Math.sin(a) * R - 2, 4, 4);
      }
      /* plasma motes */
      motes.forEach((m) => {
        m.a += m.w * dt * (0.5 + E);
        const r = m.r * size * (1 + 0.04 * Math.sin(t * 0.01 + m.a * 3));
        ctx.fillStyle = `rgba(${BLUE},${(0.35 + 0.3 * Math.sin(t * 0.008 + m.s * 5)).toFixed(3)})`;
        ctx.fillRect(cx + Math.cos(m.a) * r, cy + Math.sin(m.a) * r, m.s, m.s);
      });
      const strike = (to?: P, col?: string) => {
        if (!edge.length) return;
        const from = at(rnd(edge));
        let target = to;
        if (!target) {
          const a = Math.atan2(from.y - cy, from.x - cx) + (Math.random() - 0.5) * 0.9;
          target = { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R };
        }
        const pts: P[] = [from];
        bolt(from, target, 6, pts);
        arcs.push({ pts, life: 0, max: 90 + Math.random() * 140, col: col ?? (Math.random() < 0.2 ? PINK : Math.random() < 0.3 ? WHITE : CYAN) });
        kick = Math.min(1.5, kick + 0.6);
      };
      if (Math.random() < 0.09 * E * (dt / 16)) strike();
      const md = Math.hypot(mx - cx, my - cy);
      if (md < R * 1.9 && md > size * 0.4 && Math.random() < 0.12 * (dt / 16)) strike({ x: mx, y: my }, WHITE);
      if (burst > 0) { for (let i = 0; i < 7; i++) strike(); burst = 0; }
      arcs = arcs.filter((a) => (a.life += dt) < a.max);
      arcs.forEach((a) => glowLine(a.pts, a.col, (1 - a.life / a.max) * (0.6 + Math.random() * 0.4), 1.3));
    };

    /* ---------- 3 · Resonance: waveforms through the S, strongest at its core ---------- */
    const WAVES = [
      { col: CYAN, amp: 1, f: 0.018, sp: 0.004, ph: 0, w: 1.6 },
      { col: PINK, amp: 0.8, f: 0.024, sp: -0.005, ph: 1.3, w: 1.3 },
      { col: BLUE, amp: 0.65, f: 0.012, sp: 0.003, ph: 2.1, w: 1.2 },
      { col: WHITE, amp: 0.45, f: 0.031, sp: 0.007, ph: 0.7, w: 0.9 },
      { col: CYAN, amp: 0.35, f: 0.041, sp: -0.009, ph: 4.2, w: 0.8 },
    ];
    const resonance = () => {
      /* slow ripples */
      for (let k = 0; k < 4; k++) {
        const ph = ((t * 0.00035 + k / 4) % 1);
        circle(size * (0.5 + ph * 1.6), k % 2 ? BLUE : CYAN, (1 - ph) * 0.22);
      }
      pulses = pulses.filter((p0) => t - p0 < 2200);
      const spread = size * 0.95;
      WAVES.forEach((wv) => {
        const pts: P[] = [];
        for (let x = -4; x <= W + 4; x += 4) {
          const dx = x - cx;
          let env = Math.exp(-(dx * dx) / (spread * spread)) * E + 0.06;
          pulses.forEach((p0) => {
            const d = (t - p0) * 0.55, fade = 1 - (t - p0) / 2200;
            env += 1.4 * fade * Math.exp(-((Math.abs(dx) - d) ** 2) / 1800);
          });
          const y = cy + env * wv.amp * size * 0.32 * (Math.sin(x * wv.f + t * wv.sp + wv.ph) * 0.72 + Math.sin(x * wv.f * 2.3 - t * wv.sp * 1.6) * 0.28);
          pts.push({ x, y });
        }
        glowLine(pts, wv.col, 0.75, wv.w);
      });
      /* centre line and ticks */
      ctx.fillStyle = `rgba(${CYAN},0.35)`;
      for (let x = 0; x < W; x += 24) ctx.fillRect(x, cy - 0.5, 8, 1);
    };

    /* ---------- 4 · Field: the S as a skin of vibrating particles, drawing in a vortex of energy ---------- */
    const field = (dt: number) => {
      /* flowing field loops */
      ctx.setLineDash([3, 9]);
      for (let k = 0; k < 5; k++) {
        ctx.lineDashOffset = -t * (0.02 + 0.03 * E) * (k % 2 ? 1 : -1);
        ctx.beginPath();
        ctx.ellipse(cx, cy, size * (0.62 + k * 0.26), size * (0.2 + k * 0.1), -0.55 + Math.sin(t * 0.0003 + k) * 0.08, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${k === 2 ? PINK : CYAN},${(0.32 - k * 0.04).toFixed(3)})`; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.setLineDash([]);
      /* vortex */
      const Rf = Math.max(W, H) * 0.65;
      ctx.lineWidth = 1.2;
      free.forEach((f) => {
        if (burst > 0) { f.r += dt * 0.9 * f.v; f.a += dt * 0.0006; }
        else {
          f.r -= dt * (0.035 + 0.06 * E) * f.v * (1 + size / Math.max(f.r, 1));
          f.a += dt * 0.00045 * E * f.v * Math.min(4, size / Math.max(f.r, 1) + 0.5);
        }
        if (f.r < size * 0.3 || f.r > Rf) { spawnFree(f, burst <= 0); return; }
        const x = cx + Math.cos(f.a) * f.r, y = cy + Math.sin(f.a) * f.r * 0.82;
        if (!Number.isNaN(f.px)) {
          const a = Math.min(1, (Rf - f.r) / (Rf * 0.4)) * 0.75;
          ctx.strokeStyle = `rgba(${f.col},${a.toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(f.px, f.py); ctx.lineTo(x, y); ctx.stroke();
        }
        f.px = x; f.py = y;
      });
      if (burst > 0) burst -= dt;
    };

    /* field only: the particle skin, on its own canvas above the symbol */
    const skin = () => {
      const g = sk.getContext("2d")!;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      g.globalCompositeOperation = "lighter";
      const amp = 0.8 + E * 2.2;
      bound.forEach((b) => {
        const p = at(b.p);
        const x = p.x + Math.sin(t * b.f * 3 + b.ph) * amp + (Math.random() - 0.5) * amp;
        const y = p.y + Math.cos(t * b.f * 2.4 + b.ph) * amp + (Math.random() - 0.5) * amp;
        const a = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(t * b.f + b.ph));
        g.fillStyle = `rgba(${b.col},${a.toFixed(3)})`;
        g.fillRect(x - 0.8, y - 0.8, 1.7, 1.7);
      });
    };

    /* ---------- loop ---------- */
    const frame = (now: number) => {
      const dt = Math.min(50, now - last); last = now; t += reduce ? 0 : dt;
      const d = Math.hypot(mx - cx, my - cy), tp = Math.max(0, 1 - d / (size * 1.7));
      prox += (tp - prox) * (1 - Math.exp(-dt / 220));
      surge *= Math.exp(-dt / 750); kick *= Math.exp(-dt / 90);
      E = reduce ? 0.7 : 0.55 + 0.08 * Math.sin(t / 900) + prox * 0.5 + surge * 0.9;

      /* the vibration */
      const base = variant === "storm" ? 1.2 : variant === "field" ? 0.5 : 1;
      const amp = reduce ? 0 : base * (0.5 + E * 1.1) + kick * 2.5;
      let jx = (Math.random() - 0.5) * amp, jy = (Math.random() - 0.5) * amp;
      if (variant === "resonance" && !reduce) { jy = Math.sin(t * 0.09) * amp * 1.1; jx *= 0.4; }
      const sc = 1 + 0.012 * E * Math.sin(t * 0.018) + surge * 0.05;
      co.style.transform = `translate(${jx.toFixed(2)}px,${jy.toFixed(2)}px) scale(${sc.toFixed(4)})`;
      const split = reduce ? 0 : 1 + E * 2.6 + kick * 3 + (Math.random() < 0.05 * E ? 5 : 0);
      el.style.setProperty("--split", `${split.toFixed(2)}px`);
      el.style.setProperty("--e", Math.min(1.6, E).toFixed(3));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      if (variant === "reactor") reactor(dt);
      else if (variant === "storm") storm(dt);
      else if (variant === "resonance") resonance();
      else { field(dt); skin(); }
      ctx.globalCompositeOperation = "source-over";

      if ((readT += dt) > 120 || reduce) {
        readT = 0;
        ro.textContent = String(Math.min(100, Math.round((E / 1.5) * 100))).padStart(3, "0") + "%";
      }
      if (!reduce && visible) raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); else stop(); });
    io.observe(el);
    const onResize = () => { layout(); if (reduce) frame(performance.now()); };
    window.addEventListener("resize", onResize);

    const pos = (ev: PointerEvent) => { const r = el.getBoundingClientRect(); mx = ev.clientX - r.left; my = ev.clientY - r.top; };
    const onMove = (ev: PointerEvent) => pos(ev);
    const onLeave = () => { mx = my = -1e5; };
    const onDown = (ev: PointerEvent) => {
      pos(ev);
      surge = 1; kick = 1.5;
      if (variant === "reactor") for (let i = 0; i < 3; i++) rings.push({ r: size * (0.42 - i * 0.06), col: i === 1 ? PINK : WHITE, w: 2.4 });
      if (variant === "storm") burst = 1;
      if (variant === "resonance") pulses.push(t);
      if (variant === "field") burst = 650;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    if (img.complete && img.naturalWidth) img.onload?.(new Event("load"));

    return () => {
      stop(); io.disconnect();
      window.removeEventListener("resize", onResize);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
    };
  }, [variant]);

  return (
    <figure
      ref={root}
      className={e.root}
      data-variant={variant}
      style={{ "--sym": `url(${asset("/brand/siena-symbol.webp")})` } as CSSProperties}
    >
      <canvas ref={cv} className={e.canvas} aria-hidden="true" />
      <div ref={core} className={e.core}>
        <span className={e.halo} aria-hidden="true" />
        <span className={`${e.ghost} ${e.ghostC}`} aria-hidden="true" />
        <span className={`${e.ghost} ${e.ghostM}`} aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={e.symbol} src={asset("/brand/siena-symbol.webp")} width={600} height={600} alt="SIENA" />
        <span className={e.tail} aria-hidden="true" />
      </div>
      <canvas ref={skinCv} className={e.canvas} aria-hidden="true" />
      <span className={`${e.hud} ${e.tl}`} aria-hidden="true">[ {LABEL[variant]} ]</span>
      <span className={`${e.hud} ${e.tr}`} aria-hidden="true">Output <span ref={readout} className={e.read}>000%</span></span>
      <span className={`${e.hud} ${e.bl}`} aria-hidden="true">Connect · Automate · Intelligence</span>
      <span className={`${e.hud} ${e.br}`} aria-hidden="true"><span className={e.desk}>Move closer · click to surge</span><span className={e.mob}>Tap to surge</span></span>
      <figcaption className={e.sr}>The SIENA symbol, charged with energy.</figcaption>
    </figure>
  );
}
