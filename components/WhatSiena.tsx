"use client";
/**
 * What SIENA does — Connect → Automate → Add intelligence, built as one system while you scroll:
 * the line draws, Connect lights, a pulse travels to Automate, Automate lights, the pulse travels on,
 * Add intelligence lights with a soft bloom; each text arrives with its step. Scrubbed, so it reverses.
 * Reduced motion / no JS: the finished state.
 */
import { useEffect, useLayoutEffect, useRef } from "react";
import { WHAT } from "@/content/site";
import { registerGsap, gsap } from "@/lib/gsap";
import { CINEMATIC_QUERY } from "@/lib/mode";
import { useReveal } from "@/lib/useReveal";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const ON = { backgroundColor: "#2f7bff", borderColor: "#5b9bff", boxShadow: "0 0 12px rgba(47,123,255,0.7)" };

export function WhatSiena() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref); // eyebrow + headline

  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    registerGsap();
    const mm = gsap.matchMedia(root);
    const q = gsap.utils.selector(root);
    const build = (vertical: boolean) => () => {
      root.dataset.anim = "on";
      const list = q(".what-pillars")[0] as HTMLElement;
      const items = q(".what-step") as HTMLElement[];
      const nodes = q(".what-node");
      const pulse = q(".what-pulse")[0];
      // where each node sits along the line (measured, so it follows the layout)
      const move = (i: number) => (vertical ? { y: () => items[i].offsetTop, x: 0 } : { x: () => items[i].offsetLeft, y: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: list, start: "top 80%", end: vertical ? "bottom 68%" : "top 30%", scrub: 0.7, invalidateOnRefresh: true },
      });
      gsap.set(pulse, { autoAlpha: 0 });
      tl.fromTo(q(".what-line-fill"), vertical ? { scaleY: 0 } : { scaleX: 0 }, { scaleX: 1, scaleY: 1, duration: 1, ease: "none" }, 0);
      items.forEach((li, i) => {
        const t = i * 0.36; // each step's moment
        tl.fromTo(nodes[i], { scale: 0.6 }, { scale: 1, ...ON, duration: 0.1, ease: "back.out(2.4)" }, t + 0.02)
          .fromTo(li.querySelectorAll(".what-index, h3, p"), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.03 }, t + 0.04);
        if (i < items.length - 1) {
          // the pulse leaves this node and arrives at the next
          tl.set(pulse, move(i), t + 0.13)
            .to(pulse, { autoAlpha: 1, duration: 0.03, ease: "none" }, t + 0.14)
            .to(pulse, { ...move(i + 1), duration: 0.2, ease: "power1.inOut" }, t + 0.16)
            .to(pulse, { autoAlpha: 0, duration: 0.03, ease: "none" }, t + 0.35);
        }
      });
      // the last step arrives with a soft bloom
      tl.fromTo(q(".what-bloom"), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 0.85, scale: 1, duration: 0.14 }, 0.76)
        .to(q(".what-bloom"), { autoAlpha: 0.3, duration: 0.14, ease: "sine.inOut" }, 0.9);
      return () => { delete root.dataset.anim; };
    };
    mm.add(`${CINEMATIC_QUERY} and (min-width: 761px)`, build(false));
    mm.add(`${CINEMATIC_QUERY} and (max-width: 760px)`, build(true));
    return () => mm.revert();
  }, []);

  return (
    <section className="what" id="what" ref={ref} aria-labelledby="what-heading">
      <div className="container">
        <p className="eyebrow" data-reveal-item>{WHAT.eyebrow}</p>
        <h2 id="what-heading" className="section-title" data-reveal-item>{WHAT.headline}</h2>
        <ol className="what-pillars">
          <li className="what-line" aria-hidden="true" role="presentation">
            <span className="what-line-fill" />
            <span className="what-pulse" />
          </li>
          {WHAT.pillars.map((p, i) => (
            <li key={p.title} className="what-step">
              {i === WHAT.pillars.length - 1 && <span className="what-bloom" aria-hidden="true" />}
              <span className="what-node" aria-hidden="true" />
              <span className="what-index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
