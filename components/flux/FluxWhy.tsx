"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { asset } from "@/lib/asset";
import { WHY } from "@/content/site";

const NODES = ["Finance", "Sales", "Service", "Operations", "Marketing", "Data", "Automation", "AI"];
const C = { x: 400, y: 210 };
/* without SIENA: tools scattered, a few brittle point-to-point links */
const LOOSE = [[90, 70], [300, 40], [560, 80], [720, 150], [640, 330], [400, 370], [150, 300], [250, 190]];
const BROKEN = [[0, 7], [1, 2], [3, 4], [5, 6], [2, 7]];
/* with SIENA: every tool on one ring around the core */
const RING = NODES.map((_, i) => {
  const a = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
  return [C.x + Math.cos(a) * 300, C.y + Math.sin(a) * 160];
});

/** "Why SIENA": flip between isolated tools and one connected system, then the four principles as readouts. */
export function FluxWhy({ s }: { s: Record<string, string> }) {
  const [on, setOn] = useState(false);
  const touched = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  /* the first time the diagram is seen, it connects itself */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      t = window.setTimeout(() => { if (!touched.current) setOn(true); }, 1400);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); window.clearTimeout(t); };
  }, []);
  const pick = (v: boolean) => { touched.current = true; setOn(v); };

  return (
    <section id="why" className={s.section} data-reveal="">
      <p className={s.eyebrow}>{WHY.eyebrow}</p>
      <h2 className={s.h2}>{WHY.headline}</h2>

      <div className={s.compare} ref={ref} data-on={on || undefined}>
        <div className={s.switch} role="group" aria-label="Compare">
          <button type="button" aria-pressed={!on} onClick={() => pick(false)}>Without SIENA</button>
          <button type="button" aria-pressed={on} onClick={() => pick(true)}>With SIENA</button>
        </div>
        <svg viewBox="0 0 800 420" className={s.compareSvg} role="img"
          aria-label={on ? "With SIENA: every tool connected to one intelligent core." : "Without SIENA: isolated tools with brittle, manual links."}>
          <g className={s.broken}>
            {BROKEN.map(([a, b]) => (
              <line key={`${a}-${b}`} x1={LOOSE[a][0]} y1={LOOSE[a][1]} x2={LOOSE[b][0]} y2={LOOSE[b][1]} />
            ))}
          </g>
          <g className={s.links}>
            {RING.map(([x, y], i) => <line key={i} x1={C.x} y1={C.y} x2={x} y2={y} style={{ "--i": i } as CSSProperties} />)}
            <polygon points={RING.map((p) => p.join(",")).join(" ")} />
          </g>
          <g className={s.core}>
            <circle cx={C.x} cy={C.y} r="46" />
            <image href={asset("/brand/siena-symbol-160.webp")} x={C.x - 30} y={C.y - 30} width="60" height="60" />
          </g>
          {NODES.map((n, i) => {
            const [x, y] = on ? RING[i] : LOOSE[i];
            return (
              <g key={n} className={s.tool} style={{ transform: `translate(${x}px, ${y}px)`, "--i": i } as CSSProperties}>
                <rect x="-56" y="-16" width="112" height="32" />
                <text y="5" textAnchor="middle">{n.toUpperCase()}</text>
              </g>
            );
          })}
        </svg>
        <p className={s.compareCaption} aria-live="polite">
          {on ? "One system: every tool shares context through SIENA." : "Isolated tools: manual handoffs, double entry, no shared context."}
        </p>
      </div>

      <ul className={s.readouts}>
        {WHY.points.map((p, i) => (
          <li key={p.title} className={s.card} data-spot="" style={{ "--i": i } as CSSProperties}>
            <span className={s.readoutHead}><span className={s.cardN}>P-0{i + 1}</span><span className={s.ok}>● Active</span></span>
            <h3 className={s.h3}>{p.title}</h3>
            <p>{p.body}</p>
            <span className={s.scanline} aria-hidden="true" />
          </li>
        ))}
      </ul>
    </section>
  );
}
