import { CONTACT, SITE, SOLUTIONS, WHAT, WHY } from "@/content/site";
import { BrandLogo } from "@/components/BrandLogo";
import { Explorer } from "./Explorer";
import { Spotlight } from "./Spotlight";

/** The page below the Genesis hero. Each preview styles it with its own CSS module (same class names). */
export function Sections({ s, whatTitle }: { s: Record<string, string>; whatTitle: string }) {
  return (
    <>
      <Spotlight />
      <section id="what" className={s.section}>
        <p className={s.eyebrow}>{WHAT.eyebrow}</p>
        <h2 className={s.h2}>{whatTitle}</h2>
        <ol className={s.pillars}>
          {WHAT.pillars.map((p, i) => (
            <li key={p.title} className={s.card} data-spot="" data-tilt="">
              <span className={s.cardN}>0{i + 1}</span>
              <h3 className={s.h3}>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="solutions" className={s.section}>
        <p className={s.eyebrow}>{SOLUTIONS.eyebrow}</p>
        <h2 className={s.h2}>{SOLUTIONS.headline}</h2>
        <Explorer s={s} />
      </section>

      <section id="why" className={s.section}>
        <p className={s.eyebrow}>{WHY.eyebrow}</p>
        <h2 className={s.h2}>{WHY.headline}</h2>
        <ul className={s.why}>
          {WHY.points.map((p, i) => (
            <li key={p.title} className={s.card} data-spot="">
              <span className={s.cardN}>0{i + 1}</span>
              <h3 className={s.h3}>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className={s.section}>
        <div className={s.contact} data-spot="">
          <BrandLogo variant="symbol" alt="" className={s.contactSymbol} sizes="120px" />
          <p className={s.eyebrow}>{CONTACT.eyebrow}</p>
          <h2 className={s.h2}>{CONTACT.headline}</h2>
          <p className={s.lead}>{CONTACT.body}</p>
          <a href={`mailto:${SITE.contactEmail}`} className={s.btn} data-magnet="">{CONTACT.cta}</a>
        </div>
      </section>

      <footer className={s.foot}>
        <span>© {SITE.name} · {SITE.tagline}</span>
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
      </footer>
    </>
  );
}
