"use client";
/**
 * EvolutionTimeline — the time machine.
 * Cinematic mode: a tall track with a sticky 100vh stage; one GSAP timeline scrubbed by native scroll.
 * Chronicle mode (mobile / portrait tablet / reduced motion): the same eras as a linear story with static vignettes.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ERAS, totalWeight } from "@/content/eras";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { CINEMATIC_QUERY, LITE_QUERY, REDUCED_QUERY } from "@/lib/mode";
import { buildEvolutionTimeline, chapters } from "@/lib/choreography";
import { EraVignette, EvolutionStageScene, paletteStyle } from "./EvolutionScene";
import { EraLabel } from "./EraLabel";
import { ScrollProgress } from "./ScrollProgress";
import { Particles } from "./Particles";
import type { AvailablePlate } from "@/lib/plates.server";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Mode = "cinematic" | "chronicle" | null;

function useMode(): Mode {
  const [mode, setMode] = useState<Mode>(null);
  useEffect(() => {
    const mq = window.matchMedia(CINEMATIC_QUERY);
    const update = () => setMode(mq.matches ? "cinematic" : "chronicle");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mode;
}

export function EvolutionTimeline({ plates = [] }: { plates?: AvailablePlate[] }) {
  const mode = useMode();
  const trackRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<{ total: number } | null>(null);
  const chronRef = useRef<HTMLDivElement>(null);

  // chronicle: gentle reveal on enter (skipped entirely with reduced motion — CSS shows everything)
  useEffect(() => {
    if (mode !== "chronicle" || !chronRef.current) return;
    const items = chronRef.current.querySelectorAll(".chronicle-era");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("is-in")),
      { rootMargin: "0px 0px -12% 0px" },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, [mode]);

  useIsoLayoutEffect(() => {
    if (mode !== "cinematic" || !trackRef.current) return;
    registerGsap();
    const root = trackRef.current;
    const lite = window.matchMedia(LITE_QUERY).matches;
    const ctx = gsap.context(() => {
      const { tl, total } = buildEvolutionTimeline(root, { lite, plateEras: new Set(plates.map((p) => p.era)) });
      tlRef.current = { total };
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: lite ? 0.6 : 0.9,
        animation: tl,
        invalidateOnRefresh: false,
      });
      tl.progress(0);
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [mode, plates]);

  const jump = useCallback((i: number) => {
    const root = trackRef.current;
    const meta = tlRef.current;
    if (!root || !meta) return;
    const ch = chapters()[i];
    const t = ch.start + Math.min(0.45, ch.w * 0.3);
    const top = root.getBoundingClientRect().top + window.scrollY;
    const dist = root.offsetHeight - window.innerHeight;
    const reduced = window.matchMedia(REDUCED_QUERY).matches;
    window.scrollTo({ top: top + (t / meta.total) * dist, behavior: reduced ? "auto" : "smooth" });
  }, []);

  return (
    <section id="evolution" className="evo" aria-labelledby="evo-heading" data-mode={mode ?? "pending"}>
      <h2 id="evo-heading" className="sr-only">
        The evolution of business systems, from Abbasid-era commerce to the autonomous business
      </h2>

      {/* ───── cinematic ───── */}
      <div className="evo-track" ref={trackRef} style={{ ["--track" as string]: totalWeight }}>
        {mode === "cinematic" && (
          <div className="evo-stage">
            <EvolutionStageScene plates={plates} />
            <div className="evo-scrim" aria-hidden="true" />
            <div className="evo-particles" aria-hidden="true">
              <Particles density={0.5} tone="blue" />
            </div>
            <div className="evo-copy">
              {ERAS.map((e) => (
                <EraLabel key={e.id} era={e} />
              ))}
            </div>
            <ScrollProgress onJump={jump} />
          </div>
        )}
      </div>

      {/* ───── chronicle ───── */}
      <div className="chronicle" ref={chronRef}>
        <div className="chronicle-thread" aria-hidden="true" />
        <ol>
        {ERAS.map((e) => (
          <li key={e.id} className="chronicle-era" style={paletteStyle(e)} data-era={e.id}>
            <div className="chronicle-art">{mode === "chronicle" && <EraVignette era={e} plate={plates.filter((p) => p.era === e.id).at(-1)} />}</div>
            <EraLabel era={e} as="chronicle" />
          </li>
        ))}
        </ol>
      </div>
    </section>
  );
}
