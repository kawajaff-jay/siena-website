"use client";
/**
 * Solutions — SIENA's intelligent modules coming alive.
 * The section assembles itself as it scrolls in (scrubbed, so it reverses): eyebrow → headline →
 * a faint network line draws → the eight modules arrive one by one and softly bloom.
 * Each module carries a small animated drawing; hover/tap lifts it, brightens it and sends a
 * highlight across. Reduced motion: everything is simply shown, still.
 */
import { useEffect, useLayoutEffect, useRef } from "react";
import { SOLUTIONS } from "@/content/site";
import { registerGsap, gsap } from "@/lib/gsap";
import { CINEMATIC_QUERY } from "@/lib/mode";
import { Particles } from "./Particles";
import { SolutionVisual } from "./SolutionVisual";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Solutions() {
  const ref = useRef<HTMLElement>(null);

  // arrival + parallax, tied to scroll
  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    registerGsap();
    const mm = gsap.matchMedia(root);
    const q = gsap.utils.selector(root);

    // wide screens: the whole section assembles as one scrubbed sequence
    mm.add(`${CINEMATIC_QUERY} and (min-width: 761px)`, () => {
      root.dataset.anim = "on";
      const cards = q(".sol-card");
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: root, start: "top 88%", end: "top 12%", scrub: 0.8 },
      });
      tl.fromTo(q("[data-sol-eyebrow]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0)
        .fromTo(q("[data-sol-title]"), { autoAlpha: 0, y: 46 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.08)
        .fromTo(q(".sol-net-line--h"), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power1.inOut", stagger: 0.12 }, 0.3)
        .fromTo(q(".sol-net-line--v"), { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: "power1.out", stagger: 0.06 }, 0.62)
        .fromTo(cards, { autoAlpha: 0, y: 56, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.07 }, 0.42)
        .fromTo(q(".sol-card-bloom"), { opacity: 0 }, { opacity: 1, duration: 0.18, stagger: 0.07, ease: "sine.out" }, 0.55)
        .to(q(".sol-card-bloom"), { opacity: 0, duration: 0.3, stagger: 0.07, ease: "sine.inOut" }, 0.75);

      // depth: the headline drifts slower than the cards, the background network slower still
      const depth = gsap.timeline({ scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
      depth.fromTo(q(".sol-head"), { y: 40 }, { y: -40, ease: "none" }, 0)
        .fromTo(q(".sol-ambient-net"), { yPercent: 6 }, { yPercent: -6, ease: "none" }, 0);
      return () => { delete root.dataset.anim; };
    });

    // phones: one module per row, each arriving as it reaches the screen (lighter: no parallax)
    mm.add(`${CINEMATIC_QUERY} and (max-width: 760px)`, () => {
      root.dataset.anim = "on";
      gsap.fromTo(q("[data-sol-eyebrow], [data-sol-title]"), { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: q(".sol-head")[0], start: "top 90%", end: "top 60%", scrub: 0.6 },
      });
      q(".sol-card").forEach((card) => {
        gsap.fromTo(card, { autoAlpha: 0, y: 36, scale: 0.97 }, {
          autoAlpha: 1, y: 0, scale: 1, ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 96%", end: "top 70%", scrub: 0.6 },
        });
      });
      return () => { delete root.dataset.anim; };
    });

    return () => mm.revert();
  }, []);

  // the drawings only move while their module is on screen
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-live", e.isIntersecting)),
      { rootMargin: "0px 0px -8% 0px" },
    );
    root.querySelectorAll(".sol-card").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section className="solutions" id="solutions" ref={ref} aria-labelledby="solutions-heading">
      <div className="sol-ambient" aria-hidden="true">
        <div className="sol-glow sol-glow--a" />
        <div className="sol-glow sol-glow--b" />
        <svg className="sol-ambient-net" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
          <path d="M-40 240 C 380 170 760 330 1640 200" />
          <path d="M-40 660 C 420 740 980 560 1640 700" />
          <path d="M300 -40 C 360 300 260 620 340 940" />
        </svg>
        <div className="sol-particles">
          <Particles density={0.22} tone="blue" />
        </div>
      </div>

      <div className="container">
        <div className="sol-head">
          <p className="eyebrow" data-sol-eyebrow>{SOLUTIONS.eyebrow}</p>
          <h2 id="solutions-heading" className="section-title" data-sol-title>
            {SOLUTIONS.headline}
          </h2>
        </div>

        <div className="sol-field">
          {/* the network the modules sit on (wide screens): two rows, linked between them */}
          <div className="sol-net" aria-hidden="true">
            <span className="sol-net-line sol-net-line--h" style={{ top: "25%" }} />
            <span className="sol-net-line sol-net-line--h" style={{ top: "75%" }} />
            {[12.5, 37.5, 62.5, 87.5].map((x) => (
              <span key={x} className="sol-net-line sol-net-line--v" style={{ left: `${x}%` }} />
            ))}
          </div>
          <ul className="sol-grid">
            {SOLUTIONS.items.map((s, i) => (
              <li key={s.title} className="sol-card" data-solution={s.visual}>
                <span className="sol-card-bloom" aria-hidden="true" />
                <span className="sol-card-sheen" aria-hidden="true" />
                <div className="sol-card-top">
                  <span className="sol-card-index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <SolutionVisual kind={s.visual} />
                </div>
                <h3>{s.title}</h3>
                <p className="sol-card-body">{s.body}</p>
                <p className="sol-card-result">{s.result}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
