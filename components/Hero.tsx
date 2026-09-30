import { HERO } from "@/content/site";
import { BrandLogo } from "./BrandLogo";

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-heading">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-inner">
        <BrandLogo variant="lockup" className="hero-logo" sizes="(max-width: 700px) 62vw, 360px" priority />
        <h1 id="hero-heading" className="hero-title">
          {HERO.headline}
        </h1>
        <p className="hero-lead">{HERO.lead}</p>
      </div>
      <a href="#evolution" className="hero-cue">
        <span>{HERO.cue}</span>
        <span className="hero-cue-line" aria-hidden="true" />
      </a>
      <a href="#solutions" className="skip-story">
        Skip the story
      </a>
    </section>
  );
}
