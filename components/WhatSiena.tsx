"use client";
/** What SIENA does — three short pillars on one thin line: connect → automate → make intelligent. */
import { useRef } from "react";
import { WHAT } from "@/content/site";
import { useReveal } from "@/lib/useReveal";

export function WhatSiena() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section className="what" id="what" ref={ref} aria-labelledby="what-heading">
      <div className="container">
        <p className="eyebrow" data-reveal-item>{WHAT.eyebrow}</p>
        <h2 id="what-heading" className="section-title" data-reveal-item>{WHAT.headline}</h2>
        <ol className="what-pillars">
          {WHAT.pillars.map((p, i) => (
            <li key={p.title} data-reveal-item style={{ ["--d" as string]: `${0.12 + i * 0.12}s` } as React.CSSProperties}>
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
