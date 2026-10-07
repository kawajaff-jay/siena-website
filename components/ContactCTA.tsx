"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { CINEMATIC_QUERY } from "@/lib/mode";
import { useNear } from "@/lib/useNear";
import { CONTACT, SITE } from "@/content/site";
import { BrandLogo } from "./BrandLogo";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ContactCTA() {
  const ref = useRef<HTMLElement>(null);
  useNear(ref);

  // Scrolling: two soft lights converge on the button, the headline comes forward, the button blooms once.
  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    registerGsap();
    const mm = gsap.matchMedia(root);
    const q = gsap.utils.selector(root);
    mm.add(CINEMATIC_QUERY, () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, scrollTrigger: { trigger: root, start: "top 85%", end: "bottom bottom", scrub: 0.8 } });
      tl.fromTo(q(".contact-light--l"), { xPercent: -70, autoAlpha: 0.25 }, { xPercent: 0, autoAlpha: 1, duration: 1, ease: "sine.inOut" }, 0)
        .fromTo(q(".contact-light--r"), { xPercent: 70, autoAlpha: 0.25 }, { xPercent: 0, autoAlpha: 1, duration: 1, ease: "sine.inOut" }, 0)
        .fromTo(q(".contact .eyebrow"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.1)
        .fromTo(q(".contact .section-title"), { autoAlpha: 0, y: 36, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5 }, 0.18)
        .fromTo(q(".contact-body"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.4)
        .fromTo(q(".contact-cta .btn"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.55)
        .fromTo(q(".contact-bloom"), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "sine.out" }, 0.66)
        .to(q(".contact-bloom"), { autoAlpha: 0.4, duration: 0.2, ease: "sine.inOut" }, 0.91);
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="contact" id="contact" ref={ref} aria-labelledby="contact-heading">
      <div className="contact-lights" aria-hidden="true">
        <span className="contact-light contact-light--l" />
        <span className="contact-light contact-light--r" />
      </div>
      <div className="container contact-inner">
        <p className="eyebrow">{CONTACT.eyebrow}</p>
        <h2 id="contact-heading" className="section-title">
          {CONTACT.headline}
        </h2>
        <p className="contact-body">{CONTACT.body}</p>
        <div className="contact-cta">
          <span className="contact-bloom" aria-hidden="true" />
          <a className="btn btn--primary" href={`mailto:${SITE.contactEmail}?subject=${encodeURIComponent("Build my AI system")}`}>
            {CONTACT.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <BrandLogo variant="wordmark" alt="SIENA" className="footer-word" sizes="140px" feather={false} />
        <p>
          © {new Date().getFullYear()} SIENA — AI Solutions &amp; Systems
        </p>
      </div>
    </footer>
  );
}
