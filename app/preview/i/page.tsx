import { BrandLogo } from "@/components/BrandLogo";
import { CONTACT, HERO, SITE, SOLUTIONS, WHAT, WHY } from "@/content/site";
import s from "./i.module.css";

/** Preview I — "Aurora Prism": bright, iridescent glass; light refracted through one intelligent lens. */
export default function PreviewI() {
  return (
    <div className={s.page}>
      <div className={s.wash} aria-hidden="true"><span /><span /><span /></div>

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
        <a href="#contact" className={s.topCta}><span>Build your AI system</span></a>
      </header>

      <main id="top">
        <section className={s.hero}>
          <div className={s.heroCopy}>
            <p className={s.pill}><span>{HERO.eyebrow}</span></p>
            <h1 className={s.h1}>Every system, seen through <em>one intelligence.</em></h1>
            <p className={s.lead}>{WHAT.headline}</p>
            <div className={s.ctas}>
              <a href="#contact" className={s.btn}>Build your AI system</a>
              <a href="#solutions" className={s.link}>{HERO.secondaryCta} →</a>
            </div>
          </div>
          <div className={s.lensWrap} aria-hidden="true">
            <div className={s.beam} />
            <div className={s.lens}>
              <span className={s.lensShine} />
              <BrandLogo variant="symbol" alt="" className={s.lensSymbol} sizes="160px" priority />
            </div>
            <div className={s.spectrum}>
              {["Finance", "Sales", "Service", "Operations", "Marketing", "Data"].map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>
        </section>

        <section id="what" className={s.section}>
          <div className={s.center}>
            <p className={s.eyebrow}>{WHAT.eyebrow}</p>
            <h2 className={s.h2}>Where the three overlap, SIENA happens.</h2>
          </div>
          <div className={s.venn} role="img" aria-label="Connect, Automate and Add intelligence overlap, with SIENA at the centre">
            <span className={`${s.circle} ${s.c1}`}><b>Connect</b></span>
            <span className={`${s.circle} ${s.c2}`}><b>Automate</b></span>
            <span className={`${s.circle} ${s.c3}`}><b>Add intelligence</b></span>
            <BrandLogo variant="symbol" alt="" className={s.vennCore} sizes="80px" />
          </div>
          <ol className={s.pillars}>
            {WHAT.pillars.map((p) => (
              <li key={p.title}>
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="solutions" className={s.section}>
          <div className={s.center}>
            <p className={s.eyebrow}>{SOLUTIONS.eyebrow}</p>
            <h2 className={s.h2}>{SOLUTIONS.headline}</h2>
          </div>
          <ul className={s.tiles}>
            {SOLUTIONS.items.map((it, i) => (
              <li key={it.id} className={s.tile}>
                <span className={s.tileN}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.tileTitle}>{it.title}</h3>
                <p className={s.tileBody}>{it.body}</p>
                <p className={s.tileResult}>{it.result}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="why" className={s.section}>
          <div className={s.center}>
            <p className={s.eyebrow}>{WHY.eyebrow}</p>
            <h2 className={s.h2}>{WHY.headline}</h2>
          </div>
          <ul className={s.why}>
            {WHY.points.map((p, i) => (
              <li key={p.title}>
                <span className={s.whyDot} data-n={i} aria-hidden="true" />
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className={s.section}>
          <div className={s.contact}>
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
