import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import { BrandLogo } from "@/components/BrandLogo";
import { HERO, WHAT } from "@/content/site";
import { Genesis, type GenesisPalette } from "../_genesis/Genesis";
import { Sections } from "../_genesis/Sections";
import s from "./m.module.css";

const PALETTE: GenesisPalette = {
  dots: ["#b8945a", "#4d6bff", "#1b1d2a", "#d9b98a"],
  link: "#b8945a",
  linkAlpha: 0.55,
  pulse: "#b8945a",
  flow: "#4d6bff",
  trace: ["#d9b98a", "#4d6bff", "#9a7bff"],
};

/** Preview M — "Genesis Lumière": the interactive Genesis, elegant and futuristic. Pearl, champagne, serif. */
export default function PreviewM() {
  return (
    <div className={s.page}>
      <header className={s.top}>
        <a href="#top" className={s.brand} aria-label="SIENA — back to top">
          <BrandLogo variant="symbol" alt="" className={s.symbol} sizes="32px" priority />
          <BrandLogo variant="wordmark" alt="SIENA" className={s.word} sizes="100px" priority feather={false} />
        </a>
        <nav aria-label="Primary" className={s.nav}>
          <a href="#what">Approach</a>
          <a href="#solutions">Solutions</a>
          <a href="#why">Philosophy</a>
        </nav>
        <a href="#contact" className={s.topCta}>Begin a conversation</a>
      </header>

      <main id="top">
        <Genesis
          variant="lumiere"
          palette={PALETTE}
          wordmarkDark
          stages={["Signals", "Connections", "Form", "Intelligence"]}
          backdrop={
            <div className={s.backdrop} aria-hidden="true">
              <div className={s.pearl} />
              <div className={s.rings}><span /><span /><span /><span /></div>
              <div className={s.rays} />
            </div>
          }
          intro={
            <>
              <p className={s.kicker}>{HERO.eyebrow}</p>
              <h1 className={s.h1}>Intelligence, <em>composed.</em></h1>
              <p className={s.cue}>Scroll, and watch it take form</p>
            </>
          }
          outro={
            <>
              <p className={s.kicker}>The result</p>
              <h2 className={s.outroTitle}>From many systems, <em>one intelligence.</em></h2>
              <p className={s.lead}>{WHAT.headline}</p>
              <div className={s.ctas}>
                <a href="#contact" className={s.btn} data-magnet="">Build your AI system</a>
                <a href="#solutions" className={s.btnGhost}>Explore solutions</a>
              </div>
            </>
          }
        />
        <Sections s={s} whatTitle="Connect. Automate. Add intelligence." />
      </main>
    </div>
  );
}
