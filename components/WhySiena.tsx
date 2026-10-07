"use client";
/**
 * Why SIENA — four short reasons, quietly set.
 * Scrolling: the headline comes forward slightly, the reasons arrive one after another, each under a thin
 * blue line that grows from the left; a faint light shifts through the section. Scrubbed, so it reverses.
 * Reduced motion / no JS: the finished state.
 */
import { useEffect, useLayoutEffect, useRef } from "react";
import { WHY } from "@/content/site";
import { registerGsap, gsap } from "@/lib/gsap";
import { CINEMATIC_QUERY } from "@/lib/mode";
import { useNear } from "@/lib/useNear";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function WhySiena() {
  const ref = useRef<HTMLElement>(null);
  useNear(ref);

  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    registerGsap();
    const mm = gsap.matchMedia(root);
    const q = gsap.utils.selector(root);
    const head = () => {
      gsap.timeline({ defaults: { ease: "power2.out" }, scrollTrigger: { trigger: q(".why-head")[0], start: "top 86%", end: "top 48%", scrub: 0.7 } })
        .fromTo(q(".why-head .eyebrow"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0)
        .fromTo(q(".why-head .section-title"), { autoAlpha: 0, y: 34, scale: 0.955, transformOrigin: "0% 60%" }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 }, 0.1);
      // the ambient light travels through the section as it passes
      gsap.fromTo(q(".why-light"), { xPercent: -18, yPercent: -12 }, { xPercent: 46, yPercent: 30, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    };
    const item = (tl: gsap.core.Timeline, li: Element, t: number) =>
      tl.fromTo(li.querySelector(".why-rule"), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power1.inOut" }, t)
        .fromTo(li.querySelectorAll("h3, p"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08 }, t + 0.12);

    // wide: the four reasons enter in sequence on one scroll
    mm.add(`${CINEMATIC_QUERY} and (min-width: 761px)`, () => {
      head();
      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, scrollTrigger: { trigger: q(".why-points")[0], start: "top 84%", end: "top 36%", scrub: 0.7 } });
      q(".why-points li").forEach((li, i) => item(tl, li, i * 0.34));
    });
    // phones: one column, each reason as it reaches the screen
    mm.add(`${CINEMATIC_QUERY} and (max-width: 760px)`, () => {
      head();
      q(".why-points li").forEach((li) =>
        item(gsap.timeline({ defaults: { ease: "power2.out" }, scrollTrigger: { trigger: li, start: "top 92%", end: "top 66%", scrub: 0.6 } }), li, 0));
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="why" id="why" ref={ref} aria-labelledby="why-heading">
      <div className="why-light" aria-hidden="true" />
      <div className="container why-inner">
        <div className="why-head">
          <p className="eyebrow">{WHY.eyebrow}</p>
          <h2 id="why-heading" className="section-title">{WHY.headline}</h2>
        </div>
        <ul className="why-points">
          {WHY.points.map((p) => (
            <li key={p.title}>
              <span className="why-rule" aria-hidden="true" />
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
