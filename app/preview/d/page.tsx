import type { CSSProperties } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { CONTACT, HERO, SITE, SOLUTIONS, WHAT, WHY } from "@/content/site";
import s from "./d.module.css";

/* network geometry: 8 modules on an ellipse around the SIENA core */
const W = 1000, H = 640, CX = 500, CY = 320, RX = 400, RY = 235;
const NODES = SOLUTIONS.items.map((it, i) => {
  const a = (i / SOLUTIONS.items.length) * Math.PI * 2 - Math.PI / 2;
  return { ...it, x: CX + RX * Math.cos(a), y: CY + RY * Math.sin(a) };
});
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const LINKS = Array.from(
  new Set(NODES.flatMap((n) => n.related.map((r) => [n.id, r].sort().join("|")))),
).map((k) => k.split("|").map((id) => byId[id]));

/** Preview D — "Neural": the whole business as one living network around SIENA. */
export default function PreviewD() {
  return (
    <div className={s.page}>
      <header className={s.top}>
        <a href="#top" className={s.brand} aria-label="SIENA — back to top">
          <BrandLogo variant="symbol" alt="" className={s.symbol} sizes="32px" priority />
          <BrandLogo variant="wordmark" alt="SIENA" className={s.word} sizes="100px" priority feather={false} />
        </a>
        <nav aria-label="Primary" className={s.nav}>
          <a href="#what">Platform</a>
          <a href="#solutions">Solutions</a>
          <a href="#why">Why SIENA</a>
        </nav>
        <a href="#contact" className={s.topCta}>Build your AI system</a>
      </header>

      <main id="top">
        <section className={s.hero}>
          <div className={s.heroCopy}>
            <p className={s.eyebrow}>{HERO.eyebrow}</p>
            <h1 className={s.h1}>One intelligence.<br /><span>Every system connected.</span></h1>
            <p className={s.lead}>{WHAT.headline}</p>
            <div className={s.ctas}>
              <a href="#contact" className={s.btn}>Build your AI system</a>
              <a href="#solutions" className={s.link}>Explore the network →</a>
            </div>
          </div>

          <figure className={s.net} aria-label="SIENA at the centre, connected to Finance, Sales, Customer Service, Operations, Marketing, Data & Analytics, Automation and AI Workflows">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-hidden="true">
              <defs>
                <radialGradient id="dCore"><stop offset="0" stopColor="#3d7bff" stopOpacity=".55" /><stop offset="1" stopColor="#3d7bff" stopOpacity="0" /></radialGradient>
              </defs>
              <ellipse cx={CX} cy={CY} rx={RX} ry={RY} className={s.orbit} />
              <ellipse cx={CX} cy={CY} rx={RX * 0.55} ry={RY * 0.55} className={s.orbit} />
              {LINKS.map(([a, b]) => (
                <path key={a.id + b.id} className={s.mesh} d={`M${a.x},${a.y} Q${CX},${CY} ${b.x},${b.y}`} />
              ))}
              {NODES.map((n, i) => (
                <g key={n.id}>
                  <line x1={CX} y1={CY} x2={n.x} y2={n.y} className={s.spoke} />
                  <line x1={CX} y1={CY} x2={n.x} y2={n.y} className={s.pulse} style={{ "--i": i } as CSSProperties} />
                </g>
              ))}
              <circle cx={CX} cy={CY} r="120" fill="url(#dCore)" className={s.coreGlow} />
              {NODES.map((n, i) => {
                const right = n.x > CX + 5, left = n.x < CX - 5;
                return (
                  <g key={n.id} className={s.node} style={{ "--i": i } as CSSProperties}>
                    <circle cx={n.x} cy={n.y} r="16" className={s.nodeHalo} />
                    <circle cx={n.x} cy={n.y} r="6" className={s.nodeDot} />
                    <text
                      x={n.x + (right ? 24 : left ? -24 : 0)}
                      y={n.y + (right || left ? 5 : n.y < CY ? -28 : 38)}
                      textAnchor={right ? "start" : left ? "end" : "middle"}
                      className={s.nodeLabel}
                    >{n.title}</text>
                  </g>
                );
              })}
            </svg>
            <BrandLogo variant="symbol" alt="" className={s.core} sizes="140px" priority />
          </figure>
        </section>

        <section id="what" className={s.section}>
          <p className={s.eyebrow}>{WHAT.eyebrow}</p>
          <h2 className={s.h2}>Three layers of one system.</h2>
          <ol className={s.layers}>
            {WHAT.pillars.map((p, i) => (
              <li key={p.title} style={{ "--i": i } as CSSProperties}>
                <span className={s.ring} aria-hidden="true"><span /></span>
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="solutions" className={s.section}>
          <p className={s.eyebrow}>{SOLUTIONS.eyebrow}</p>
          <h2 className={s.h2}>{SOLUTIONS.headline}</h2>
          <ul className={s.cards}>
            {SOLUTIONS.items.map((it) => (
              <li key={it.id} className={s.card}>
                <div className={s.cardTop}>
                  <span className={s.cardDot} aria-hidden="true" />
                  <h3 className={s.h3}>{it.title}</h3>
                </div>
                <p className={s.cardBody}>{it.body}</p>
                <p className={s.synapse}>
                  <span>Signals</span>
                  {it.related.map((r) => <em key={r}>{byId[r].title}</em>)}
                </p>
                <p className={s.cardResult}>{it.result}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="why" className={`${s.section} ${s.why}`}>
          <div>
            <p className={s.eyebrow}>{WHY.eyebrow}</p>
            <h2 className={s.h2}>{WHY.headline}</h2>
          </div>
          <ul className={s.whyList}>
            {WHY.points.map((p) => (
              <li key={p.title}>
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className={s.contact}>
          <div className={s.contactGlow} aria-hidden="true" />
          <p className={s.eyebrow}>{CONTACT.eyebrow}</p>
          <h2 className={s.h2}>{CONTACT.headline}</h2>
          <p className={s.lead}>{CONTACT.body}</p>
          <a href={`mailto:${SITE.contactEmail}`} className={s.btn}>{CONTACT.cta}</a>
        </section>
      </main>

      <footer className={s.foot}>
        <span>© {SITE.name} · {SITE.tagline}</span>
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
      </footer>
    </div>
  );
}
