"use client";
/**
 * Hero — quietly alive.
 * Idle: the symbol's glow breathes very slowly, a soft blue light drifts behind the logo, and now and
 * then a faint highlight crosses the main button. Scrolling: logo, headline and background separate
 * slightly in depth (scrubbed, reversible). Reduced motion: still.
 */
import { useEffect, useLayoutEffect, useRef } from "react";
import { HERO } from "@/content/site";
import { registerGsap, gsap } from "@/lib/gsap";
import { CINEMATIC_QUERY } from "@/lib/mode";
import { useNear } from "@/lib/useNear";
import { BrandLogo } from "./BrandLogo";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useNear(ref, "0px");

  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    registerGsap();
    const mm = gsap.matchMedia(root);
    const q = gsap.utils.selector(root);
    mm.add(CINEMATIC_QUERY, () => {
      const small = window.matchMedia("(max-width: 760px)").matches;
      const k = small ? 0.5 : 1; // gentler depth on phones
      const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 } });
      tl.to(q(".hero-bg"), { y: 90 * k }, 0) // the light stays behind
        .to(q("[data-depth='logo']"), { y: -18 * k }, 0)
        .to(q("[data-depth='title']"), { y: -46 * k }, 0)
        .to(q("[data-depth='lead']"), { y: -64 * k }, 0)
        .to(q("[data-depth='actions']"), { y: -78 * k }, 0);
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="hero-heading">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-glow" />
        <div className="hero-light" />
      </div>
      <div className="hero-inner">
        <div className="hero-part">
          <div className="hero-logo-wrap" data-depth="logo">
            <span className="hero-symbol-glow" aria-hidden="true" />
            <BrandLogo variant="lockup" className="hero-logo" sizes="(max-width: 700px) 62vw, 360px" priority />
          </div>
        </div>
        <div className="hero-part">
          <h1 id="hero-heading" className="hero-title" data-depth="title">
            {HERO.headline}
          </h1>
        </div>
        <div className="hero-part">
          <p className="hero-lead" data-depth="lead">{HERO.lead}</p>
        </div>
        <div className="hero-part">
          <div className="hero-actions" data-depth="actions">
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
      </div>
    </section>
  );
}
