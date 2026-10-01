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

/** Lets the story layer drive the timeline: jump to a chapter, and know where a chapter starts. */
export type TimelineApi = {
  /** scroll to era i (index into ERAS) */
  jump: (i: number, behavior?: ScrollBehavior) => void;
  /** scroll offset (in the scroller) at which era i begins */
  offsetOf: (i: number) => number;
};

/** scroller: the element that scrolls the story (the full-screen story layer); defaults to the page. */
export function EvolutionTimeline({
  plates = [],
  scroller,
  onApi,
}: {
  plates?: AvailablePlate[];
  scroller?: HTMLElement | null;
  onApi?: (api: TimelineApi) => void;
}) {
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
        scroller: scroller ?? undefined,
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
  }, [mode, plates, scroller]);

  /** scroll offset of the timeline's top and the scrollable distance, in the scroller's coordinates */
  const frame = useCallback(() => {
    const root = trackRef.current!;
    if (scroller) {
      return { top: root.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop, dist: root.offsetHeight - scroller.clientHeight };
    }
    return { top: root.getBoundingClientRect().top + window.scrollY, dist: root.offsetHeight - window.innerHeight };
  }, [scroller]);

  const offsetOf = useCallback(
    (i: number) => {
      // chronicle (reduced motion): the era's own block
      if (mode === "chronicle") {
        const el = chronRef.current?.querySelectorAll<HTMLElement>(".chronicle-era")[i];
        if (!el) return 0;
        const base = scroller ? scroller.getBoundingClientRect().top - scroller.scrollTop : -window.scrollY;
        return el.getBoundingClientRect().top - base;
      }
      const meta = tlRef.current;
      if (!trackRef.current || !meta) return 0;
      const ch = chapters()[i];
      const t = ch.start + Math.min(0.45, ch.w * 0.3);
      const { top, dist } = frame();
      return top + (t / meta.total) * dist;
    },
    [mode, scroller, frame],
  );

  const jump = useCallback(
    (i: number, behavior?: ScrollBehavior) => {
      const reduced = window.matchMedia(REDUCED_QUERY).matches;
      const b: ScrollBehavior = behavior ?? (reduced ? "auto" : "smooth");
      const y = offsetOf(i);
      (scroller ?? window).scrollTo({ top: y, behavior: b });
    },
    [scroller, offsetOf],
  );

  // hand the controls to the story layer once the timeline exists
  useEffect(() => {
    if (!onApi || !mode) return;
    if (mode === "cinematic" && !tlRef.current) return;
    onApi({ jump, offsetOf });
  }, [onApi, mode, jump, offsetOf]);

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
