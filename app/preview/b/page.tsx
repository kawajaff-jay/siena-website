import type { CSSProperties } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { CONTACT, SITE, SOLUTIONS, WHAT, WHY } from "@/content/site";
import s from "./b.module.css";

const WIDE = new Set(["finance", "analytics", "automation", "ai"]);
const finance = SOLUTIONS.items[0];
const CONNECTS = Array.from(new Set(SOLUTIONS.items.flatMap((i) => i.connects))).filter((c) => !c.startsWith("Every") && !c.startsWith("Your"));

/** Preview B — "Console": dark software-product look, live workflow hero, bento solutions. */
export default function PreviewB() {
  return (
    <div className={s.page}>
      <header className={s.top}>
        <a href="#top" className={s.brand} aria-label="SIENA — back to top">
          <BrandLogo variant="symbol" alt="" className={s.symbol} sizes="32px" priority />
          <BrandLogo variant="wordmark" alt="SIENA" className={s.word} sizes="100px" priority feather={false} />
        </a>
        <nav aria-label="Primary" className={s.nav}>
          <a href="#how">How it works</a>
          <a href="#solutions">Solutions</a>
          <a href="#why">Why SIENA</a>
        </nav>
        <a href="#contact" className={s.topCta}>Build your AI system</a>
      </header>

      <main id="top">
        <section className={s.hero}>
          <div className={s.heroCopy}>
            <p className={s.chip}><span className={s.dot} /> {SITE.tagline}</p>
            <h1 className={s.h1}>
              Your business systems, <span className={s.grad}>working as one.</span>
            </h1>
            <p className={s.lead}>{WHAT.headline}</p>
            <div className={s.ctas}>
              <a href="#contact" className={s.btnPrimary}>Build your AI system</a>
              <a href="#solutions" className={s.btnGhost}>Explore solutions</a>
            </div>
          </div>

          <div className={s.console} aria-label={`Example: the ${finance.title} workflow`} role="img">
            <div className={s.consoleBar}>
              <span /><span /><span />
              <p>siena · {finance.title.toLowerCase()} workflow</p>
              <em><span className={s.dot} /> Live</em>
            </div>
            <ol className={s.run}>
              {finance.workflow.map((w, i) => (
                <li key={w} style={{ "--i": i } as CSSProperties}>
                  <span className={s.tick} aria-hidden="true" />
                  <span>{w}</span>
                  <span className={s.ms}>{(0.4 + i * 0.3).toFixed(1)}s</span>
                </li>
              ))}
            </ol>
            <div className={s.consoleFoot}>
              <span>Result</span>
              <strong>{finance.result}</strong>
            </div>
          </div>
        </section>

        <section className={s.strip} aria-label="Works with the software you already use">
          <p>Works with the software you already use</p>
          <ul>
            {CONNECTS.slice(0, 14).map((c) => <li key={c}>{c}</li>)}
          </ul>
        </section>

        <section id="how" className={s.section}>
          <Head eyebrow={WHAT.eyebrow} title="Three layers. One system." />
          <ol className={s.layers}>
            {WHAT.pillars.map((p, i) => (
              <li key={p.title} className={s.layer}>
                <span className={s.layerN}>0{i + 1}</span>
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="solutions" className={s.section}>
          <Head eyebrow={SOLUTIONS.eyebrow} title={SOLUTIONS.headline} />
          <ul className={s.bento}>
            {SOLUTIONS.items.map((it, i) => {
              const wide = WIDE.has(it.id);
              return (
                <li key={it.id} className={`${s.cell} ${wide ? s.wide : ""}`}>
                  <span className={s.cellN}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={s.h3}>{it.title}</h3>
                  <p className={s.cellBody}>{it.body}</p>
                  {wide && (
                    <ol className={s.flow} aria-label="How it works">
                      {it.workflow.slice(0, 4).map((w) => <li key={w}>{w}</li>)}
                    </ol>
                  )}
                  <p className={s.result}><span aria-hidden="true">↗</span> {it.result}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section id="why" className={s.section}>
          <Head eyebrow={WHY.eyebrow} title={WHY.headline} />
          <ul className={s.why}>
            {WHY.points.map((p) => (
              <li key={p.title}>
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className={s.section}>
          <div className={s.cta}>
            <BrandLogo variant="symbol" alt="" className={s.ctaSymbol} sizes="120px" />
            <p className={s.eyebrow}>{CONTACT.eyebrow}</p>
            <h2 className={s.h2}>{CONTACT.headline}</h2>
            <p className={s.lead}>{CONTACT.body}</p>
            <a href={`mailto:${SITE.contactEmail}`} className={s.btnPrimary}>{CONTACT.cta}</a>
          </div>
        </section>
      </main>

      <footer className={s.foot}>
        <span>© {SITE.name} · {SITE.tagline}</span>
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
      </footer>
    </div>
  );
}

function Head({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className={s.head}>
      <p className={s.eyebrow}>{eyebrow}</p>
      <h2 className={s.h2}>{title}</h2>
    </div>
  );
}
