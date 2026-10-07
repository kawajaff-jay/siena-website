import { BrandLogo } from "@/components/BrandLogo";
import { CONTACT, REVEAL, SITE, SOLUTIONS, WHAT, WHY } from "@/content/site";
import s from "./c.module.css";

const TICKER = SOLUTIONS.items.map((i) => i.title);

/** Preview C — "Signal": bold Swiss layout, full-bleed SIENA blue, giant type, sticky split sections. */
export default function PreviewC() {
  return (
    <div className={s.page}>
      <header className={s.top}>
        <a href="#top" className={s.brand} aria-label="SIENA — back to top">
          <span className={s.badge}><BrandLogo variant="symbol" alt="" className={s.symbol} sizes="32px" priority /></span>
          <BrandLogo variant="wordmark" alt="SIENA" className={s.word} sizes="110px" priority feather={false} />
        </a>
        <nav aria-label="Primary" className={s.nav}>
          <a href="#what">What</a>
          <a href="#solutions">Solutions</a>
          <a href="#why">Why</a>
          <a href="#contact" className={s.navCta}>Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className={s.hero}>
          <p className={s.heroTag}>
            <span>{SITE.tagline}</span>
            <span>The Evolution of Business Systems</span>
          </p>
          <h1 className={s.h1}>
            {REVEAL.lines.map((l) => (
              <span key={l.text} className={l.highlight ? s.h1Hl : undefined}>{l.text}</span>
            ))}
          </h1>
          <div className={s.heroFoot}>
            <p>{WHAT.headline}</p>
            <a href="#contact" className={s.bigBtn}>
              Build your AI system <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <div className={s.ticker} aria-hidden="true">
          <div className={s.tickerTrack}>
            {[0, 1].map((k) => (
              <span key={k}>
                {TICKER.map((t) => <span key={t}>{t}<b>✳</b></span>)}
              </span>
            ))}
          </div>
        </div>

        <section id="what" className={s.split}>
          <div className={s.splitLeft}>
            <p className={s.label}>{WHAT.eyebrow}</p>
            <h2 className={s.h2}>Connect.<br />Automate.<br />Think.</h2>
          </div>
          <ol className={s.splitRight}>
            {WHAT.pillars.map((p, i) => (
              <li key={p.title}>
                <span className={s.bigN}>{i + 1}</span>
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="solutions" className={s.dark}>
          <div className={s.darkHead}>
            <p className={s.label}>{SOLUTIONS.eyebrow}</p>
            <h2 className={s.h2}>{SOLUTIONS.headline}</h2>
          </div>
          <ul className={s.grid}>
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

        <section id="why" className={s.blue}>
          <p className={s.label}>{WHY.eyebrow}</p>
          <h2 className={s.h2}>{WHY.headline}</h2>
          <ol className={s.whyGrid}>
            {WHY.points.map((p, i) => (
              <li key={p.title}>
                <span className={s.whyN}>0{i + 1}</span>
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="contact" className={s.contact}>
          <p className={s.label}>{CONTACT.eyebrow}</p>
          <h2 className={s.contactTitle}>{CONTACT.headline}</h2>
          <div className={s.contactFoot}>
            <p>{CONTACT.body}</p>
            <a href={`mailto:${SITE.contactEmail}`} className={s.bigBtnDark}>
              {CONTACT.cta} <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>

      <footer className={s.foot}>
        <span>{SITE.name}</span>
        <span>From paper. To software. To intelligence.</span>
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
      </footer>
    </div>
  );
}
