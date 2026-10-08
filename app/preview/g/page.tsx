import "@fontsource-variable/jetbrains-mono/wght.css";
import { BrandLogo } from "@/components/BrandLogo";
import { CONTACT, HERO, SITE, SOLUTIONS, WHAT, WHY } from "@/content/site";
import s from "./g.module.css";

/* schematic: 4 modules left, 4 right, SIENA core in the middle */
const BOX_W = 210, BOX_H = 52, CORE = { x: 400, y: 170, w: 200, h: 200 };
const SCHEMA = SOLUTIONS.items.map((it, i) => {
  const left = i < 4;
  const row = i % 4;
  return { id: it.id, title: it.title, x: left ? 20 : 770, y: 40 + row * 120, left };
});

/** Preview G — "Blueprint": SIENA drawn as an engineered system — technical, precise, architectural. */
export default function PreviewG() {
  return (
    <div className={s.page}>
      <header className={s.top}>
        <a href="#top" className={s.brand} aria-label="SIENA — back to top">
          <BrandLogo variant="symbol" alt="" className={s.symbol} sizes="32px" priority />
          <BrandLogo variant="wordmark" alt="SIENA" className={s.word} sizes="100px" priority feather={false} />
        </a>
        <nav aria-label="Primary" className={s.nav}>
          <a href="#fig2">[02] Method</a>
          <a href="#fig3">[03] Modules</a>
          <a href="#fig4">[04] Principles</a>
        </nav>
        <a href="#contact" className={s.topCta}>Request a system design</a>
      </header>

      <main id="top">
        <section className={s.hero}>
          <p className={s.sheet}>SHEET 01 / 05 — SYSTEM OVERVIEW</p>
          <h1 className={s.h1}>{HERO.headline}.</h1>
          <p className={s.lead}>{WHAT.headline}</p>

          <figure className={s.fig}>
            <div className={s.figArt}>
            <svg viewBox="0 0 1000 540" role="img" aria-label="Schematic: eight business modules wired into the SIENA core">
              <defs>
                <marker id="gArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" className={s.arrowHead} />
                </marker>
              </defs>
              {/* dimension line */}
              <line x1="20" y1="14" x2="980" y2="14" className={s.dim} markerStart="url(#gArrow)" markerEnd="url(#gArrow)" />
              <text x="500" y="10" className={s.dimText} textAnchor="middle">ONE CONNECTED SYSTEM</text>
              {SCHEMA.map((b) => {
                const sx = b.left ? b.x + BOX_W : b.x;
                const sy = b.y + BOX_H / 2;
                const cx = b.left ? CORE.x : CORE.x + CORE.w;
                const midX = b.left ? (sx + cx) / 2 : (sx + cx) / 2;
                const ty = Math.min(Math.max(sy, CORE.y + 20), CORE.y + CORE.h - 20);
                return (
                  <g key={b.id}>
                    <path d={`M${sx},${sy} H${midX} V${ty} H${cx}`} className={s.wire} markerEnd="url(#gArrow)" />
                    <path d={`M${sx},${sy} H${midX} V${ty} H${cx}`} className={s.signal} />
                    <circle cx={midX} cy={sy} r="3.5" className={s.joint} />
                    <rect x={b.x} y={b.y} width={BOX_W} height={BOX_H} className={s.box} />
                    <text x={b.x + 14} y={b.y + 21} className={s.boxId}>M-{String(SOLUTIONS.items.findIndex((i) => i.id === b.id) + 1).padStart(2, "0")}</text>
                    <text x={b.x + 14} y={b.y + 40} className={s.boxLabel}>{b.title.toUpperCase()}</text>
                  </g>
                );
              })}
              <rect x={CORE.x} y={CORE.y} width={CORE.w} height={CORE.h} className={s.core} />
              <rect x={CORE.x + 8} y={CORE.y + 8} width={CORE.w - 16} height={CORE.h - 16} className={s.coreInner} />
              <text x={CORE.x + CORE.w / 2} y={CORE.y + CORE.h + 26} textAnchor="middle" className={s.dimText}>CORE — CONNECT · AUTOMATE · INTELLIGENCE</text>
            </svg>
            <BrandLogo variant="symbol" alt="" className={s.coreSymbol} sizes="120px" priority />
            </div>
            <figcaption className={s.caption}>FIG. 01 — Every function wired into one intelligent core.</figcaption>
          </figure>

          <dl className={s.titleBlock}>
            <div><dt>Project</dt><dd>{SITE.name}</dd></div>
            <div><dt>Discipline</dt><dd>{SITE.tagline}</dd></div>
            <div><dt>Revision</dt><dd>2026 · Intelligence</dd></div>
            <div><dt>Status</dt><dd className={s.live}>● Operational</dd></div>
          </dl>
        </section>

        <section id="fig2" className={s.section}>
          <SheetHead n="02" eyebrow={WHAT.eyebrow} title="Method: three stages, one flow." />
          <ol className={s.stages}>
            {WHAT.pillars.map((p, i) => (
              <li key={p.title}>
                <span className={s.stageTag}>STAGE {i + 1}</span>
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="fig3" className={s.section}>
          <SheetHead n="03" eyebrow={SOLUTIONS.eyebrow} title={SOLUTIONS.headline} />
          <div className={s.modules}>
            {SOLUTIONS.items.map((it, i) => (
              <article key={it.id} className={s.module}>
                <header className={s.moduleHead}>
                  <span className={s.moduleId}>M-{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={s.h3}>{it.title}</h3>
                  <p>{it.body}</p>
                </header>
                <ol className={s.flow}>
                  {it.workflow.map((w) => <li key={w}>{w}</li>)}
                </ol>
                <p className={s.output}><span>OUTPUT</span> {it.result}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="fig4" className={s.section}>
          <SheetHead n="04" eyebrow={WHY.eyebrow} title={WHY.headline} />
          <table className={s.spec}>
            <thead><tr><th>Ref</th><th>Principle</th><th>Specification</th></tr></thead>
            <tbody>
              {WHY.points.map((p, i) => (
                <tr key={p.title}><td>P-0{i + 1}</td><td>{p.title}</td><td>{p.body}</td></tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="contact" className={s.section}>
          <SheetHead n="05" eyebrow={CONTACT.eyebrow} title={CONTACT.headline} />
          <div className={s.contact}>
            <p>{CONTACT.body}</p>
            <a href={`mailto:${SITE.contactEmail}`} className={s.btn}>{CONTACT.cta} →</a>
          </div>
        </section>
      </main>

      <footer className={s.foot}>
        <span>© {SITE.name} — {SITE.tagline}</span>
        <span>Drawn for the next evolution of business.</span>
      </footer>
    </div>
  );
}

function SheetHead({ n, eyebrow, title }: { n: string; eyebrow: string; title: string }) {
  return (
    <div className={s.sheetHead}>
      <p className={s.sheet}>SHEET {n} / 05 — {eyebrow.toUpperCase()}</p>
      <h2 className={s.h2}>{title}</h2>
    </div>
  );
}
