import { HERO, REVEAL } from "@/content/site";
import { BrandLogo } from "./BrandLogo";

/** story=false: the page without the evolution timeline (/lite) */
export function Hero({ story = true }: { story?: boolean }) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-heading">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-inner">
        <BrandLogo variant="lockup" className="hero-logo" sizes="(max-width: 700px) 62vw, 360px" priority />
        {story ? (
          <>
            <h1 id="hero-heading" className="hero-title">
              {HERO.headline}
            </h1>
            <p className="hero-lead">{HERO.lead}</p>
          </>
        ) : (
          <>
            <h1 id="hero-heading" className="hero-title hero-title--lines">
              {REVEAL.lines.map((l) => (
                <span key={l.text} className={l.highlight ? "reveal-hl" : undefined}>
                  {l.text}
                </span>
              ))}
            </h1>
            <p className="hero-lead">{REVEAL.support}</p>
            <div className="reveal-ctas hero-ctas">
              {REVEAL.ctas.map((c) => (
                <a key={c.label} href={c.href} className={`btn btn--${c.variant}`}>
                  {c.label}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
      {story && (
        <a href="#evolution" className="hero-cue">
          <span>{HERO.cue}</span>
          <span className="hero-cue-line" aria-hidden="true" />
        </a>
      )}
      {story && (
        <a href="#solutions" className="skip-story">
          Skip the story
        </a>
      )}
    </section>
  );
}
