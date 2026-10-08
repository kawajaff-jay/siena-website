import { BrandLogo } from "@/components/BrandLogo";
import { CONTACT, HERO, SITE, SOLUTIONS, WHAT, WHY } from "@/content/site";
import s from "./f.module.css";

/** Preview F — "Aurora": light, calm and human — soft light, glass and orbiting intelligence. */
export default function PreviewF() {
  return (
    <div className={s.page}>
      <div className={s.aurora} aria-hidden="true"><span /><span /><span /></div>

      <header className={s.top}>
        <a href="#top" className={s.brand} aria-label="SIENA — back to top">
          <BrandLogo variant="symbol" alt="" className={s.symbol} sizes="32px" priority />
          <BrandLogo variant="wordmark" alt="SIENA" className={s.word} sizes="100px" priority feather={false} />
        </a>
        <nav aria-label="Primary" className={s.nav}>
          <a href="#what">Approach</a>
          <a href="#solutions">Solutions</a>
          <a href="#why">Why SIENA</a>
          <a href="#contact" className={s.navCta}>Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className={s.hero}>
          <div className={s.orbitWrap} aria-hidden="true">
            <span className={s.o1}><i /></span>
            <span className={s.o2}><i /></span>
            <span className={s.o3}><i /></span>
            <BrandLogo variant="symbol" alt="" className={s.heroSymbol} sizes="160px" priority />
          </div>
          <p className={s.pill}>{HERO.eyebrow}</p>
          <h1 className={s.h1}>Intelligence that works <em>the way your business does.</em></h1>
          <p className={s.lead}>{WHAT.headline}</p>
          <div className={s.ctas}>
            <a href="#contact" className={s.btn}>Build your AI system</a>
            <a href="#solutions" className={s.btnGlass}>{HERO.secondaryCta}</a>
          </div>
        </section>

        <section id="what" className={s.section}>
          <p className={s.eyebrow}>{WHAT.eyebrow}</p>
          <h2 className={s.h2}>Connect. Automate. Add intelligence.</h2>
          <ol className={s.pillars}>
            {WHAT.pillars.map((p, i) => (
              <li key={p.title} className={s.glass}>
                <span className={s.pillarN}>0{i + 1}</span>
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="solutions" className={s.section}>
          <div className={s.solHead}>
            <div>
              <p className={s.eyebrow}>{SOLUTIONS.eyebrow}</p>
              <h2 className={s.h2}>{SOLUTIONS.headline}</h2>
            </div>
            <p className={s.swipe}>Scroll sideways →</p>
          </div>
          <ul className={s.rail}>
            {SOLUTIONS.items.map((it, i) => (
              <li key={it.id} className={`${s.glass} ${s.slide}`}>
                <span className={s.slideN}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.slideTitle}>{it.title}</h3>
                <p className={s.slideBody}>{it.body}</p>
                <ul className={s.uses}>
                  {it.uses.slice(0, 3).map((u) => <li key={u}>{u}</li>)}
                </ul>
                <p className={s.slideResult}>{it.result}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="why" className={s.section}>
          <p className={s.eyebrow}>{WHY.eyebrow}</p>
          <h2 className={s.h2}>{WHY.headline}</h2>
          <ul className={s.why}>
            {WHY.points.map((p) => (
              <li key={p.title} className={s.glass}>
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className={s.section}>
          <div className={`${s.glass} ${s.contact}`}>
            <p className={s.eyebrow}>{CONTACT.eyebrow}</p>
            <h2 className={s.h2}>{CONTACT.headline}</h2>
            <p className={s.lead}>{CONTACT.body}</p>
            <a href={`mailto:${SITE.contactEmail}`} className={s.btn}>{CONTACT.cta}</a>
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
