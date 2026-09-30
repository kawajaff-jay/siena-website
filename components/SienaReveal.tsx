"use client";
/**
 * SienaReveal — the final statement.
 * Centuries of business evolution → 100 years of acceleration → FROM PAPER. TO SOFTWARE. TO INTELLIGENCE.
 * → SIENA · AI SOLUTIONS & SYSTEMS → CTAs.
 */
import { useEffect, useLayoutEffect, useRef } from "react";
import { REVEAL } from "@/content/site";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { CINEMATIC_QUERY } from "@/lib/mode";
import { BrandLogo } from "./BrandLogo";
import { Particles } from "./Particles";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** opening: used as the first section of the page — starts on the symbol and the first line, with a scroll cue. */
export function SienaReveal({ opening = false }: { opening?: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    if (!ref.current) return;
    registerGsap();
    const mm = gsap.matchMedia(ref.current);
    mm.add(CINEMATIC_QUERY, () => {
      const root = ref.current!;
      root.dataset.anim = "on";
      const q = gsap.utils.selector(root);
      const portrait = window.matchMedia("(max-aspect-ratio: 1/1)").matches;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      gsap.set([q("[data-k1]"), q("[data-k2]"), q("[data-line]"), q("[data-brand] > *"), q("[data-openword] > *")], { autoAlpha: 0 });
      // opening: the S alone → the full SIENA logo → the S steps back behind "Centuries of business evolution"
      const O = opening ? 1.2 : 0;
      if (opening) {
        tl.fromTo(q("[data-halo]"), { scale: 0.6, autoAlpha: 1 }, { scale: 0.6, autoAlpha: 1, duration: 0.01 }, 0)
          .to(q("[data-cue]"), { autoAlpha: 0, duration: 0.3 }, 0.05)
          .fromTo(q("[data-openword] > *"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.15 }, 0.15)
          .to(q("[data-openword] > *"), { autoAlpha: 0, y: -12, duration: 0.4, ease: "power2.in" }, 1.05)
          .to(q("[data-halo]"), { scale: 1, autoAlpha: 0.3, duration: 0.7, ease: "power2.inOut" }, 1.1)
          .fromTo(q("[data-k1]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.5);
      } else {
        tl.fromTo(q("[data-halo]"), { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 0.3, duration: 1 }, 0)
          .fromTo(q("[data-k1]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.3);
      }
      tl.to(q("[data-k1]"), { autoAlpha: 0, y: -24, duration: 0.5, ease: "power2.in" }, 1.4 + O + (opening ? 0.4 : 0))
        .fromTo(q("[data-k2]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.8 + O + 0.4 * +opening)
        .to(q("[data-k2]"), { autoAlpha: 0, y: -24, duration: 0.5, ease: "power2.in" }, 2.9 + O + 0.4 * +opening)
        .to(q("[data-halo]"), { autoAlpha: 0.12, duration: 0.6 }, 3.1 + O + 0.4 * +opening)
        .fromTo(q("[data-line]"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.45 }, 3.3 + O + 0.4 * +opening)
        .fromTo(q(".reveal-hl"), { textShadow: "0 0 0px rgba(47,123,255,0)" }, { textShadow: "0 0 36px rgba(47,123,255,0.65)", duration: 0.6 }, 4.4 + O + 0.4 * +opening)
        // wide screens: the statement shrinks above the brand; tall/narrow screens have no room, so it gives way
        .to(q("[data-lines]"), portrait ? { autoAlpha: 0, y: -40, duration: 0.7, ease: "power2.in" } : { scale: 0.46, yPercent: -118, duration: 0.9, ease: "power2.inOut" }, 5.4 + O + 0.4 * +opening)
        .to(q("[data-halo]"), { autoAlpha: 0, duration: 0.6 }, 5.4 + O + 0.4 * +opening)
        .fromTo(q("[data-brand] > *"), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.18 }, 5.9 + O + 0.4 * +opening)
        .to({}, { duration: 0.8 });
      const st = ScrollTrigger.create({ trigger: q(".reveal-track")[0], start: "top top", end: "bottom bottom", scrub: 0.8, animation: tl });
      ScrollTrigger.refresh();
      return () => { st.kill(); tl.kill(); delete root.dataset.anim; };
    });
    return () => mm.revert();
  }, [opening]);

  return (
    <section className="reveal" id={opening ? "top" : undefined} ref={ref} aria-labelledby="reveal-heading">
      <div className="reveal-track">
        <div className="reveal-stage">
          <Particles density={0.8} tone="blue" />
          <svg className="reveal-traces" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path d="M-50 720 C 400 640 700 780 1650 560" />
            <path d="M-50 180 C 500 260 1100 120 1650 240" />
          </svg>
          <div className="reveal-halo" data-halo aria-hidden="true">
            <BrandLogo variant="symbol" alt="" sizes="(max-width: 700px) 60vw, 520px" />
          </div>
          {opening && (
            <div className="reveal-openword" data-openword>
              <BrandLogo variant="wordmark" alt="SIENA" sizes="(max-width: 700px) 56vw, 300px" priority feather={false} />
              <span className="reveal-openword-tag">AI Solutions &amp; Systems</span>
            </div>
          )}
          <p className="reveal-kicker" data-k1>{REVEAL.kicker1}</p>
          <p className="reveal-kicker" data-k2>{REVEAL.kicker2}</p>
          <h2 className="reveal-lines" id="reveal-heading" data-lines>
            {REVEAL.lines.map((l) => (
              <span key={l.text} data-line className={l.highlight ? "reveal-hl" : undefined}>
                {l.text}
              </span>
            ))}
          </h2>
          <div className="reveal-brand" data-brand>
            <BrandLogo variant="lockup" sizes="(max-width: 700px) 64vw, 340px" />
            <p className="reveal-support">{REVEAL.support}</p>
            <div className="reveal-ctas">
              {REVEAL.ctas.map((c) => (
                <a key={c.label} href={c.href} className={`btn btn--${c.variant}`}>
                  {c.label}
                </a>
              ))}
            </div>
          </div>
          {opening && (
            <div className="hero-cue reveal-cue" data-cue aria-hidden="true">
              <span>Scroll</span>
              <span className="hero-cue-line" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
