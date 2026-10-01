"use client";
/** Why SIENA — four short reasons, quietly set. */
import { useRef } from "react";
import { WHY } from "@/content/site";
import { useReveal } from "@/lib/useReveal";

export function WhySiena() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section className="why" id="why" ref={ref} aria-labelledby="why-heading">
      <div className="container why-inner">
        <div className="why-head">
          <p className="eyebrow" data-reveal-item>{WHY.eyebrow}</p>
          <h2 id="why-heading" className="section-title" data-reveal-item>{WHY.headline}</h2>
        </div>
        <ul className="why-points">
          {WHY.points.map((p, i) => (
            <li key={p.title} data-reveal-item style={{ ["--d" as string]: `${0.08 + i * 0.1}s` } as React.CSSProperties}>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
