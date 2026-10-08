import type { CSSProperties } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { CONTACT, HERO, SITE, SOLUTIONS, WHAT, WHY } from "@/content/site";
import s from "./h.module.css";

/** Preview H — "Aurora Dusk": the aurora at night. Northern-lights ribbons over a deep sky, dark glass. */
export default function PreviewH() {
  return (
    <div className={s.page}>
      <div className={s.sky} aria-hidden="true">
        <span className={s.stars} />
        <span className={s.ribbon1} />
        <span className={s.ribbon2} />
        <span className={s.ribbon3} />
      </div>

      <header className={s.top}>
        <a href="#top" className={s.brand} aria-label="SIENA — back to top">
          <BrandLogo variant="symbol" alt="" className={s.symbol} sizes="32px" priority />
          <BrandLogo variant="wordmark" alt="SIENA" className={s.word} sizes="100px" priority feather={false} />
        </a>
        <nav aria-label="Primary" className={s.nav}>
          <a href="#what">Approach</a>
          <a href="#solutions">Solutions</a>
          <a href="#why">Why SIENA</a>
        </nav>
        <a href="#contact" className={s.topCta}>Build your AI system</a>
      </header>

      <main id="top">
        <section className={s.hero}>
          <p className={s.pill}><span className={s.spark} aria-hidden="true" /> {HERO.eyebrow}</p>
          <h1 className={s.h1}>
            A new light <br />for how business <em>thinks.</em>
          </h1>
          <p className={s.lead}>{WHAT.headline}</p>
          <div className={s.ctas}>
            <a href="#contact" className={s.btn}>Build your AI system</a>
            <a href="#solutions" className={s.btnGlass}>{HERO.secondaryCta}</a>
          </div>
          <a href="#what" className={s.cue}>Scroll<span aria-hidden="true" /></a>
        </section>

        <section id="what" className={s.section}>
          <p className={s.eyebrow}>{WHAT.eyebrow}</p>
          <h2 className={s.h2}>From scattered tools to one intelligent flow.</h2>
          <ol className={s.path}>
            {WHAT.pillars.map((p, i) => (
              <li key={p.title} style={{ "--i": i } as CSSProperties}>
                <span className={s.star} aria-hidden="true" />
                <span className={s.pathN}>Phase {i + 1}</span>
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="solutions" className={s.section}>
          <p className={s.eyebrow}>{SOLUTIONS.eyebrow}</p>
          <h2 className={s.h2}>{SOLUTIONS.headline}</h2>
          <ul className={s.sols}>
            {SOLUTIONS.items.map((it, i) => (
              <li key={it.id} className={s.sol} style={{ "--h": (i * 37) % 360 } as CSSProperties}>
                <span className={s.solGlow} aria-hidden="true" />
                <div className={s.solMain}>
                  <span className={s.solN}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={s.solTitle}>{it.title}</h3>
                  <p className={s.solBody}>{it.body}</p>
                </div>
                <p className={s.solResult}>{it.result}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="why" className={s.section}>
          <div className={s.whyWrap}>
            <div>
              <p className={s.eyebrow}>{WHY.eyebrow}</p>
              <h2 className={s.h2}>{WHY.headline}</h2>
            </div>
            <ul className={s.why}>
              {WHY.points.map((p) => (
                <li key={p.title}>
                  <h3 className={s.h3}>{p.title}</h3>
                  <p>{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className={s.contact}>
          <BrandLogo variant="symbol" alt="" className={s.contactSymbol} sizes="120px" />
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
