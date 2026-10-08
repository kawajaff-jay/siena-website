import type { CSSProperties } from "react";
import { asset } from "@/lib/asset";
import { BUILDS, STORY_FUNCTIONS, SOLUTIONS, WHAT } from "@/content/site";
import { Counter } from "./Reveal";

/* pipeline geometry (viewBox 1200 × 300) */
const IN_X = 150, CONNECT = { x: 430, y: 150 }, AUTOMATE = { x: 690, y: 150 }, CORE = { x: 950, y: 150 }, OUT_X = 1140;
const INPUTS = STORY_FUNCTIONS.map((f, i) => ({ ...f, y: 40 + i * 44 }));

/** "What SIENA does" as a live system diagram: business functions → Connect → Automate → SIENA core → action. */
export function FluxWhat({ s }: { s: Record<string, string> }) {
  return (
    <section id="what" className={s.section} data-reveal="">
      <p className={s.eyebrow}>{WHAT.eyebrow}</p>
      <p className={s.buildsText}>
        {BUILDS.intro}{" "}
        {BUILDS.parts.map((b) => (
          <span key={b.key}><strong>{b.key}</strong> {b.text} </span>
        ))}
      </p>

      <figure className={s.pipe}>
        <svg viewBox="0 0 1200 300" role="img" aria-label="Your business functions flow through Connect and Automate into the SIENA core, which turns them into decisions and action.">
          <defs>
            <linearGradient id="pWire" x1="0" x2="1">
              <stop offset="0" stopColor="#33e1ff" stopOpacity=".15" />
              <stop offset="1" stopColor="#33e1ff" stopOpacity=".7" />
            </linearGradient>
          </defs>
          {INPUTS.map((f, i) => {
            const d = `M${IN_X + 10},${f.y} C${IN_X + 140},${f.y} ${CONNECT.x - 150},${CONNECT.y} ${CONNECT.x - 34},${CONNECT.y}`;
            return (
              <g key={f.id} style={{ "--i": i } as CSSProperties}>
                <path d={d} className={s.pipeWire} />
                <path d={d} className={s.pipeFlow} />
                <circle cx={IN_X} cy={f.y} r="5" className={s.pipeIn} />
                <text x={IN_X - 16} y={f.y + 4} textAnchor="end" className={s.pipeLabel}>{f.label.toUpperCase()}</text>
              </g>
            );
          })}
          {[[CONNECT, AUTOMATE], [AUTOMATE, CORE]].map(([a, b], i) => (
            <g key={i} style={{ "--i": i + 6 } as CSSProperties}>
              <line x1={a.x + 34} y1={a.y} x2={b.x - (i ? 58 : 34)} y2={b.y} className={s.pipeWire} />
              <line x1={a.x + 34} y1={a.y} x2={b.x - (i ? 58 : 34)} y2={b.y} className={s.pipeFlow} />
            </g>
          ))}
          <g style={{ "--i": 8 } as CSSProperties}>
            <line x1={CORE.x + 58} y1={CORE.y} x2={OUT_X - 10} y2={CORE.y} className={s.pipeWire} />
            <line x1={CORE.x + 58} y1={CORE.y} x2={OUT_X - 10} y2={CORE.y} className={s.pipeFlow} />
          </g>

          {[{ ...CONNECT, t: "CONNECT", n: "01" }, { ...AUTOMATE, t: "AUTOMATE", n: "02" }].map((n) => (
            <g key={n.t} className={s.pipeNode}>
              <rect x={n.x - 34} y={n.y - 34} width="68" height="68" className={s.pipeBox} />
              <text x={n.x} y={n.y + 5} textAnchor="middle" className={s.pipeNum}>{n.n}</text>
              <text x={n.x} y={n.y + 62} textAnchor="middle" className={s.pipeLabel}>{n.t}</text>
            </g>
          ))}
          <g className={s.pipeNode}>
            <circle cx={CORE.x} cy={CORE.y} r="58" className={s.pipeCore} />
            <circle cx={CORE.x} cy={CORE.y} r="74" className={s.pipeRing} />
            <image href={asset("/brand/siena-symbol-160.webp")} x={CORE.x - 36} y={CORE.y - 36} width="72" height="72" />
            <text x={CORE.x} y={CORE.y + 104} textAnchor="middle" className={s.pipeLabel}>ADD INTELLIGENCE</text>
          </g>
          <g className={s.pipeNode}>
            <circle cx={OUT_X} cy={CORE.y} r="7" className={s.pipeOut} />
            <text x={OUT_X} y={CORE.y - 22} textAnchor="middle" className={s.pipeLabel}>ACTION</text>
          </g>
        </svg>
      </figure>

      <ol className={s.stages}>
        {WHAT.pillars.map((p, i) => (
          <li key={p.title} className={s.card} data-spot="" style={{ "--i": i } as CSSProperties}>
            <span className={s.cardN}>Stage 0{i + 1}</span>
            <h3 className={s.h3}>{p.title}</h3>
            <p>{p.body}</p>
          </li>
        ))}
      </ol>

      <dl className={s.stats}>
        <div><dt>Modules</dt><dd><Counter to={SOLUTIONS.items.length} /></dd></div>
        <div><dt>Business functions</dt><dd><Counter to={STORY_FUNCTIONS.length} /></dd></div>
        <div><dt>Connected system</dt><dd><Counter to={1} /></dd></div>
      </dl>
    </section>
  );
}
