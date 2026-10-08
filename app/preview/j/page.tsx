import type { CSSProperties } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { CONTACT, HERO, SITE, SOLUTIONS, WHAT, WHY } from "@/content/site";
import s from "./j.module.css";

/* each stacked card gets its own pair of aurora tints */
const TINTS = [
  ["#ffd2bf", "#e5d4ff"], ["#d8e8ff", "#ffe0ef"], ["#e3f7ee", "#dcd6ff"], ["#fff0c9", "#ffd6d2"],
  ["#e6dcff", "#cfeaff"], ["#ffdbe9", "#fff1d6"], ["#d3f2f5", "#e2e3ff"], ["#ffe1cf", "#d9f0e6"],
];

/** Preview J — "Aurora Bloom": warm sunrise aurora, soft grain, big calm type, solutions that stack as you scroll. */
export default function PreviewJ() {
  return (
    <div className={s.page}>
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
        <a href="#contact" className={s.topCta}>Let’s talk</a>
      </header>

      <main id="top">
        <section className={s.hero}>
          <div className={s.sun} aria-hidden="true"><span /><span /><span /></div>
          <p className={s.kicker}>{HERO.eyebrow}</p>
          <h1 className={s.h1}>The next evolution of business <em>is already rising.</em></h1>
          <p className={s.lead}>{WHAT.headline}</p>
          <div className={s.ctas}>
            <a href="#contact" className={s.btn}>Build your AI system</a>
            <a href="#solutions" className={s.btnSoft}>{HERO.secondaryCta}</a>
          </div>
        </section>

        <section id="what" className={s.section}>
          <p className={s.eyebrow}>{WHAT.eyebrow}</p>
          <h2 className={s.h2}>Connect. Automate. Add intelligence.</h2>
          <ol className={s.orbs}>
            {WHAT.pillars.map((p, i) => (
              <li key={p.title}>
                <span className={s.orb} data-n={i} aria-hidden="true" />
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="solutions" className={s.section}>
          <p className={s.eyebrow}>{SOLUTIONS.eyebrow}</p>
          <h2 className={s.h2}>{SOLUTIONS.headline}</h2>
          <ul className={s.stack}>
            {SOLUTIONS.items.map((it, i) => (
              <li
                key={it.id}
                className={s.card}
                style={{ "--i": i, "--t1": TINTS[i][0], "--t2": TINTS[i][1] } as CSSProperties}
              >
                <div className={s.cardLeft}>
                  <span className={s.cardN}>{String(i + 1).padStart(2, "0")} / {String(SOLUTIONS.items.length).padStart(2, "0")}</span>
                  <h3 className={s.cardTitle}>{it.title}</h3>
                  <p className={s.cardBody}>{it.body}</p>
                  <p className={s.cardResult}>{it.result}</p>
                </div>
                <ol className={s.cardFlow} aria-label="How it works">
                  {it.workflow.map((w) => <li key={w}>{w}</li>)}
                </ol>
              </li>
            ))}
          </ul>
        </section>

        <section id="why" className={s.section}>
          <p className={s.eyebrow}>{WHY.eyebrow}</p>
          <h2 className={s.h2}>{WHY.headline}</h2>
          <ul className={s.why}>
            {WHY.points.map((p) => (
              <li key={p.title}>
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className={s.contact}>
          <div className={s.contactSun} aria-hidden="true" />
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
