"use client";
/**
 * Particles — a very light canvas field of drifting blue motes.
 * ≤ 70 particles, DPR-capped, paused when off-screen / tab hidden, disabled for reduced motion.
 */
import { useEffect, useRef } from "react";

export function Particles({ density = 1, tone = "blue" }: { density?: number; tone?: "blue" | "white" }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, raf = 0, visible = false;
    const count = Math.round(70 * density * (window.innerWidth < 900 ? 0.4 : 1));
    const rgb = tone === "blue" ? "90,150,255" : "220,230,255";
    const ps = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(), r: 0.4 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.00012, vy: -0.00004 - Math.random() * 0.00012,
      a: 0.15 + Math.random() * 0.5, t: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy; p.t += 0.01;
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        if (p.x < -0.02) p.x = 1.02; else if (p.x > 1.02) p.x = -0.02;
        ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(p.t));
        ctx.fillStyle = `rgb(${rgb})`;
        ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, [density, tone]);

  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}
