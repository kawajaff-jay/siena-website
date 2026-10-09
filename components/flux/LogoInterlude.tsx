"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { asset } from "@/lib/asset";
import { SERVICES } from "@/content/site";
import l from "./interlude.module.css";

export type InterludeVariant = "sweep" | "zoom" | "marquee" | "tilt" | "lockup";

const LINE = "Built around your business.";

/** The official SIENA symbol with the pink tail laid over it (as in the header). Never redrawn. */
function Mark({ className = "" }: { className?: string }) {
  return (
    <span className={`${l.mark} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/brand/siena-symbol.webp")} width={600} height={600} alt="SIENA" />
      <span className={l.tail} aria-hidden="true" />
      <span className={l.sheen} aria-hidden="true" />
    </span>
  );
}

/**
 * A short visual pause between reading sections: the SIENA logo, simple and catchy. Five styles:
 * sweep (a light passes over the S), zoom (the S grows as you scroll), marquee (the services glide behind the S),
 * tilt (the S tilts toward your cursor), lockup (the full logo wipes in).
 */
export function LogoInterlude({ variant }: { variant: InterludeVariant }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* replay the entrance each time it comes into view */
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) el.dataset.in = "";
      else if (en.boundingClientRect.top > 0) delete el.dataset.in;
    }, { threshold: 0.35 });
    io.observe(el);
    if (reduce) { el.dataset.in = ""; return () => io.disconnect(); }

    let raf = 0;
    const cleanups: (() => void)[] = [() => io.disconnect(), () => cancelAnimationFrame(raf)];

    /* scroll progress through the section, 0 → 1 */
    if (variant === "zoom" || variant === "marquee") {
      const tick = () => {
        const r = el.getBoundingClientRect(), vh = window.innerHeight;
        const p = variant === "zoom"
          ? Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)))
          : Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        el.style.setProperty("--p", p.toFixed(4));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    /* tilt toward the cursor; drift gently on its own when the cursor is away */
    if (variant === "tilt") {
      let tx = 0, ty = 0, x = 0, y = 0, hover = false;
      const onMove = (ev: PointerEvent) => {
        const r = el.getBoundingClientRect();
        tx = ((ev.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((ev.clientY - r.top) / r.height - 0.5) * 2;
        hover = true;
      };
      const onLeave = () => { hover = false; };
      const tick = (now: number) => {
        const gx = hover ? tx : Math.sin(now / 2400) * 0.45;
        const gy = hover ? ty : Math.cos(now / 3100) * 0.3;
        x += (gx - x) * 0.08; y += (gy - y) * 0.08;
        el.style.setProperty("--tx", x.toFixed(4));
        el.style.setProperty("--ty", y.toFixed(4));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      cleanups.push(() => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); });
    }

    return () => cleanups.forEach((f) => f());
  }, [variant]);

  const words = SERVICES.map((s) => s.title);

  return (
    <section ref={root} id="interlude" className={l.root} data-variant={variant} aria-label="SIENA" style={{ "--sym": `url(${asset("/brand/siena-symbol.webp")})` } as CSSProperties}>
      <div className={l.stage}>
        <span className={l.glow} aria-hidden="true" />

        {variant === "marquee" && (
          <div className={l.rows} aria-hidden="true">
            {[0, 1].map((row) => (
              <div key={row} className={l.row} style={{ "--dir": row ? 1 : -1 } as CSSProperties}>
                {[0, 1, 2].map((k) => (
                  <span key={k}>{words.map((w) => <span key={w} className={l.word}>{w}<i>✦</i></span>)}</span>
                ))}
              </div>
            ))}
          </div>
        )}

        {variant === "lockup" ? (
          <span className={l.lockup}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/brand/siena-lockup.webp")} width={904} height={850} alt="SIENA — AI Solutions & Systems" />
          </span>
        ) : (
          <span className={l.holder}><Mark /></span>
        )}

        {variant !== "marquee" && (
          <p className={l.line}>
            {LINE.split(" ").map((w, i) => <span key={i} style={{ "--i": i } as CSSProperties}>{w} </span>)}
          </p>
        )}
      </div>
    </section>
  );
}
