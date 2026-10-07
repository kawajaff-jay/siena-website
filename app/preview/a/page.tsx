import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import { BrandLogo } from "@/components/BrandLogo";
import { CONTACT, HERO, SITE, SOLUTIONS, WHAT, WHY } from "@/content/site";
import s from "./a.module.css";

const ERAS = [
  { year: "c. 750 CE", label: "From paper.", note: "The scribe’s ledger: every record kept by hand." },
  { year: "1970s", label: "To software.", note: "Systems arrive — one tool for every department." },
  { year: "2026", label: "To intelligence.", note: "One connected system that understands and acts.", hl: true },
];

/** Preview A — "Ledger": editorial, light, serif. A nod to SIENA's paper-to-intelligence story. */
export default function PreviewA() {
  return (
    <div className={s.page}>
      <header className={s.top}>
        <a href="#top" className={s.brand} aria-label="SIENA — back to top">
          <BrandLogo variant="symbol" alt="" className={s.symbol} sizes="36px" priority />
          <BrandLogo variant="wordmark" alt="SIENA" className={s.word} sizes="110px" priority feather={false} />
        </a>
        <nav aria-label="Primary" className={s.nav}>
          <a href="#what">What we do</a>
          <a href="#solutions">Solutions</a>
          <a href="#why">Why SIENA</a>
        </nav>
        <a href="#contact" className={s.topCta}>Build your AI system</a>
      </header>

      <main id="top">
        <section className={s.hero}>
          <p className={s.meta}>
            <span>{HERO.eyebrow}</span>
            <span>Vol. I — The Evolution of Business Systems</span>
          </p>
          <h1 className={s.h1}>
            Business systems, from the scribe’s ledger to <em>intelligence.</em>
          </h1>
          <div className={s.heroFoot}>
            <p className={s.lead}>{WHAT.headline}</p>
            <div className={s.ctas}>
              <a href="#contact" className={s.btn}>Start the conversation</a>
              <a href="#solutions" className={s.textLink}>{HERO.secondaryCta} →</a>
            </div>
          </div>
        </section>

        <ol className={s.eras} aria-label="From paper to software to intelligence">
          {ERAS.map((e) => (
            <li key={e.year} className={e.hl ? s.eraHl : undefined}>
              <span className={s.eraYear}>{e.year}</span>
              <span className={s.eraLabel}>{e.label}</span>
              <span className={s.eraNote}>{e.note}</span>
            </li>
          ))}
        </ol>

        <section id="what" className={s.section}>
          <SectionHead n="01" eyebrow={WHAT.eyebrow} title="Connect. Automate. Add intelligence." />
          <div className={s.pillars}>
            {WHAT.pillars.map((p, i) => (
              <article key={p.title} className={s.pillar}>
                <span className={s.pillarN}>{["i", "ii", "iii"][i]}.</span>
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="solutions" className={s.section}>
          <SectionHead n="02" eyebrow={SOLUTIONS.eyebrow} title={SOLUTIONS.headline} />
          <p className={s.hint}>Open any line to see how it works.</p>
          <div className={s.index}>
            {SOLUTIONS.items.map((it, i) => (
              <details key={it.id} className={s.row}>
                <summary className={s.rowHead}>
                  <span className={s.rowN}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.rowTitle}>{it.title}</span>
                  <span className={s.rowBody}>{it.body}</span>
                  <span className={s.rowPlus} aria-hidden="true" />
                </summary>
                <div className={s.rowDetail}>
                  <div>
                    <h4 className={s.h4}>{SOLUTIONS.drawer.workflow}</h4>
                    <ol className={s.steps}>
                      {it.workflow.map((w) => <li key={w}>{w}</li>)}
                    </ol>
                  </div>
                  <div>
                    <h4 className={s.h4}>{SOLUTIONS.drawer.connects}</h4>
                    <p className={s.connects}>{it.connects.join(" · ")}</p>
                    <h4 className={s.h4}>{SOLUTIONS.drawer.outcome}</h4>
                    <p className={s.outcome}>{it.result}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section id="why" className={`${s.section} ${s.why}`}>
          <div className={s.whyHead}>
            <SectionHead n="03" eyebrow={WHY.eyebrow} title={WHY.headline} />
          </div>
          <ol className={s.whyList}>
            {WHY.points.map((p) => (
              <li key={p.title}>
                <h3 className={s.h3}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="contact" className={s.contact}>
          <p className={s.eyebrow}>{CONTACT.eyebrow}</p>
          <h2 className={s.contactTitle}>
            Let’s design the <em>next evolution</em> of your business.
          </h2>
          <p className={s.contactBody}>{CONTACT.body}</p>
          <a href={`mailto:${SITE.contactEmail}`} className={s.mail}>{SITE.contactEmail}</a>
        </section>
      </main>

      <footer className={s.foot}>
        <span>© {SITE.name} — {SITE.tagline}</span>
        <span>From paper. To software. To intelligence.</span>
      </footer>
    </div>
  );
}

function SectionHead({ n, eyebrow, title }: { n: string; eyebrow: string; title: string }) {
  return (
    <div className={s.head}>
      <span className={s.headN}>§ {n}</span>
      <p className={s.eyebrow}>{eyebrow}</p>
      <h2 className={s.h2}>{title}</h2>
    </div>
  );
}
