import { BrandLogo } from "@/components/BrandLogo";
import { CONTACT, HERO, SITE, SOLUTIONS, WHAT, WHY } from "@/content/site";
import { GenesisHero } from "./GenesisHero";
import s from "./k.module.css";

/** Preview K — "Aurora Genesis": Aurora light, with a hero where the SIENA symbol is built as you scroll. */
export default function PreviewK() {
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
        <GenesisHero>
          <h2 className={s.outroTitle}>From scattered data <em>to one intelligence.</em></h2>
          <p className={s.lead}>{WHAT.headline}</p>
          <div className={s.ctas}>
            <a href="#contact" className={s.btn}>Build your AI system</a>
            <a href="#solutions" className={s.btnGlass}>{HERO.secondaryCta}</a>
          </div>
        </GenesisHero>

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
          <p className={s.eyebrow}>{SOLUTIONS.eyebrow}</p>
          <h2 className={s.h2}>{SOLUTIONS.headline}</h2>
          <ul className={s.grid}>
            {SOLUTIONS.items.map((it, i) => (
              <li key={it.id} className={`${s.glass} ${s.tile}`}>
                <span className={s.tileN}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.tileTitle}>{it.title}</h3>
                <p className={s.tileBody}>{it.body}</p>
                <p className={s.tileResult}>{it.result}</p>
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
            <BrandLogo variant="symbol" alt="" className={s.contactSymbol} sizes="120px" />
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
