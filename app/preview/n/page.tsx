import "@fontsource-variable/jetbrains-mono/wght.css";
import { BrandLogo } from "@/components/BrandLogo";
import { HERO, WHAT } from "@/content/site";
import { Genesis, type GenesisPalette } from "../_genesis/Genesis";
import { Sections } from "../_genesis/Sections";
import s from "./n.module.css";

const PALETTE: GenesisPalette = {
  dots: ["#ffffff", "#c9ced8", "#8d939f", "#ffffff"],
  link: "#ffffff",
  linkAlpha: 0.7,
  pulse: "#ffffff",
  flow: "#2f7bff",
  trace: ["#ffffff", "#9fb4ff", "#2f7bff"],
};

/** Preview N — "Genesis Noir": the interactive Genesis, noir futuristic. Black, grain, light — the cursor is your torch. */
export default function PreviewN() {
  return (
    <div className={s.page}>
      <div className={s.grain} aria-hidden="true" />
      <header className={s.top}>
        <a href="#top" className={s.brand} aria-label="SIENA — back to top">
          <BrandLogo variant="symbol" alt="" className={s.symbol} sizes="32px" priority />
          <BrandLogo variant="wordmark" alt="SIENA" className={s.word} sizes="100px" priority feather={false} />
        </a>
        <nav aria-label="Primary" className={s.nav}>
          <a href="#what">System</a>
          <a href="#solutions">Modules</a>
          <a href="#why">Why</a>
        </nav>
        <a href="#contact" className={s.topCta}>Contact</a>
      </header>

      <main id="top">
        <Genesis
          variant="noir"
          palette={PALETTE}
          stages={["Noise", "Signal", "Pattern", "Intelligence"]}
          backdrop={
            <div className={s.backdrop} aria-hidden="true">
              <div className={s.blinds} />
              <div className={s.beam} />
              <div className={s.vignette} />
            </div>
          }
          intro={
            <>
              <p className={s.kicker}>{HERO.eyebrow}</p>
              <h1 className={s.h1}>Every business<br />leaves a <em>trace.</em></h1>
              <p className={s.cue}>Scroll — and use your light</p>
            </>
          }
          outro={
            <>
              <p className={s.kicker}>Case closed</p>
              <h2 className={s.outroTitle}>From noise, <em>to intelligence.</em></h2>
              <p className={s.lead}>{WHAT.headline}</p>
              <div className={s.ctas}>
                <a href="#contact" className={s.btn} data-magnet="">Build your AI system</a>
                <a href="#solutions" className={s.btnGhost}>Explore modules</a>
              </div>
            </>
          }
        />
        <Sections s={s} whatTitle="Connect. Automate. Add intelligence." />
      </main>
    </div>
  );
}
