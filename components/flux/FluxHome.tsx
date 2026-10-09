import "@fontsource-variable/jetbrains-mono/wght.css";
import type { ReactNode } from "react";
import { HERO, WHAT } from "@/content/site";
import { Genesis, type GenesisPalette } from "@/components/genesis/Genesis";
import { Spotlight } from "@/components/genesis/Spotlight";
import { FluxHeader } from "@/components/flux/FluxHeader";
import { FluxWhat } from "@/components/flux/FluxWhat";
import { FluxWhy } from "@/components/flux/FluxWhy";
import { FluxContact } from "@/components/flux/FluxContact";
import { FluxFooter } from "@/components/flux/FluxFooter";
import { Counters, Reveal } from "@/components/flux/Reveal";
import { SolutionsTide } from "@/components/flux/SolutionsTide";
import s from "@/app/home.module.css";

const PALETTE: GenesisPalette = {
  dots: ["#33e1ff", "#7aa2ff", "#ff4fd8", "#e6f7ff"],
  link: "#33e1ff",
  linkAlpha: 0.75,
  pulse: "#ff4fd8",
  flow: "#33e1ff",
  trace: ["#ff4fd8", "#33e1ff", "#7aa2ff"],
};

/**
 * The Genesis Flux homepage. `solutions` replaces the solutions section (used by design previews);
 * by default it is the Tide wheel (SolutionsTide). `core` replaces the About diagram (energy-core previews). Keep the section id "solutions" so the header and footer links work.
 */
export function FluxHome({ solutions, core }: { solutions?: ReactNode; core?: ReactNode }) {
  return (
    <div className={s.page}>
      <Reveal />
      <Counters />
      <Spotlight />
      <FluxHeader s={s} />

      <main id="top">
        <Genesis
          variant="flux"
          palette={PALETTE}
          logoTail="#ff4fd8"
          stages={["Signals", "Connections", "Pattern", "Intelligence"]}
          backdrop={
            <div className={s.backdrop} aria-hidden="true">
              <div className={s.haze} />
              <div className={s.floor}><div className={s.grid} /></div>
              <div className={s.scan} />
              <span className={`${s.corner} ${s.tl}`} /><span className={`${s.corner} ${s.tr}`} />
              <span className={`${s.corner} ${s.bl}`} /><span className={`${s.corner} ${s.br}`} />
            </div>
          }
          intro={
            <>
              <p className={s.kicker}>[ {HERO.eyebrow} ]</p>
              <h1 className={s.h1}>
                <span className={s.glitch} data-text="Intelligence,">Intelligence,</span><br />
                <em>assembling.</em>
              </h1>
              <p className={s.cue}>Scroll to initialise <span aria-hidden="true">↓</span></p>
            </>
          }
          outro={
            <>
              <p className={s.kicker}>[ System online ]</p>
              <h2 className={s.outroTitle}>From scattered data <em>to one intelligence.</em></h2>
              <p className={s.lead}>{WHAT.headline}</p>
              <div className={s.ctas}>
                <a href="#contact" className={s.btn} data-magnet="">Build your AI system</a>
                <a href="#solutions" className={s.btnGhost}>Explore modules</a>
              </div>
            </>
          }
        />

        <FluxWhat s={s} core={core} />

        {solutions ?? <SolutionsTide />}

        <FluxWhy s={s} />
        <FluxContact s={s} />
      </main>
      <FluxFooter s={s} />
    </div>
  );
}
