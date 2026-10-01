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
        <div className="hero-actions">
          {/* opens the full-screen Evolution story (StoryLayer) */}
          <a href="#evolution" className="btn btn--primary hero-story" data-open-story>
            {HERO.storyCta} <span aria-hidden="true">→</span>
          </a>
          <p className="hero-story-note">{HERO.storyNote}</p>
          <a href="#solutions" className="hero-secondary">
            {HERO.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  );
}
