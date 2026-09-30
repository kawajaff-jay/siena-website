"use client";
/**
 * BrandIntro — the home page opening (the end of the evolution story on its own).
 * The SIENA logo fills the first screen; scrolling moves it into place and builds
 * FROM PAPER. → TO SOFTWARE. → TO INTELLIGENCE. → support line → CTAs.
 * Scrubbed to scroll (reversible). Reduced motion / no JS: the finished layout, static.
 */
import { useEffect, useLayoutEffect, useRef } from "react";
import { REVEAL } from "@/content/site";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { CINEMATIC_QUERY } from "@/lib/mode";
import { BrandLogo } from "./BrandLogo";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function BrandIntro() {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    if (!ref.current) return;
    registerGsap();
    const mm = gsap.matchMedia(ref.current);
    mm.add(CINEMATIC_QUERY, () => {
      const root = ref.current!;
      root.dataset.anim = "on";
      const q = gsap.utils.selector(root);
      const stage = q("[data-stage]")[0] as HTMLElement;
      const logo = q("[data-logo]")[0] as HTMLElement;
      // distance from the logo's resting place to the centre of the screen
      const toCentre = () => {
        const s = stage.getBoundingClientRect();
        const l = logo.getBoundingClientRect();
        const y = Number(gsap.getProperty(logo, "y")) || 0;
        return s.top + s.height / 2 - (l.top - y + l.height / 2);
      };
      gsap.set([q("[data-line]"), q("[data-lead]"), q("[data-ctas]")], { autoAlpha: 0 });
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.fromTo(logo, { y: toCentre, scale: 1.45 }, { y: 0, scale: 1, duration: 1.1, ease: "power2.inOut" }, 0)
        .fromTo(q("[data-glow]"), { top: "50%", scale: 1.25 }, { top: "34%", scale: 1, duration: 1.1, ease: "power2.inOut" }, 0)
        .to(q("[data-cue]"), { autoAlpha: 0, duration: 0.3 }, 0)
        .fromTo(q("[data-line]"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.5 }, 0.8)
        .fromTo(q(".reveal-hl"), { textShadow: "0 0 0px rgba(47,123,255,0)" }, { textShadow: "0 0 36px rgba(47,123,255,0.65)", duration: 0.6 }, 2.2)
        .fromTo(q("[data-lead]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 2.5)
        .fromTo(q("[data-ctas]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 2.8)
        .to({}, { duration: 0.5 });
      const st = ScrollTrigger.create({
        trigger: q("[data-track]")[0], start: "top top", end: "bottom bottom",
        scrub: 0.8, animation: tl, invalidateOnRefresh: true,
      });
      ScrollTrigger.refresh();
      return () => { st.kill(); tl.kill(); delete root.dataset.anim; };
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="intro" id="top" ref={ref} aria-labelledby="intro-heading">
      <div className="intro-track" data-track>
        <div className="hero intro-stage" data-stage>
          <div className="hero-glow" data-glow aria-hidden="true" />
          <div className="intro-inner">
            <div data-logo className="intro-logo">
              <BrandLogo variant="lockup" className="hero-logo" sizes="(max-width: 700px) 62vw, 360px" priority />
            </div>
            <h1 id="intro-heading" className="hero-title hero-title--lines">
              {REVEAL.lines.map((l) => (
                <span key={l.text} data-line className={l.highlight ? "reveal-hl" : undefined}>
                  {l.text}
                </span>
              ))}
            </h1>
            <p className="hero-lead" data-lead>{REVEAL.support}</p>
            <div className="reveal-ctas hero-ctas" data-ctas>
              {REVEAL.ctas.map((c) => (
                <a key={c.label} href={c.href} className={`btn btn--${c.variant}`}>
                  {c.label}
                </a>
              ))}
            </div>
          </div>
          <div className="hero-cue intro-cue" data-cue aria-hidden="true">
            <span>Scroll</span>
            <span className="hero-cue-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
