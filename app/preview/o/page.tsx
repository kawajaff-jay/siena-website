import "@fontsource-variable/jetbrains-mono/wght.css";
import { BrandLogo } from "@/components/BrandLogo";
import { HERO, SITE, WHAT } from "@/content/site";
import { Genesis, type GenesisPalette } from "@/components/genesis/Genesis";
import { Sections } from "@/components/genesis/Sections";
import s from "./o.module.css";

const PALETTE: GenesisPalette = {
  dots: ["#33e1ff", "#7aa2ff", "#2f7bff", "#e6f7ff"],
  link: "#33e1ff",
  linkAlpha: 0.75,
  pulse: "#5b9bff",
  flow: "#33e1ff",
  trace: ["#2f7bff", "#33e1ff", "#7aa2ff"],
};

/** Preview O — "Genesis Flux Blue": Flux with every pink/magenta accent replaced by SIENA blues. */
export default function PreviewO() {
  return (
    <div className={s.page}>
      <header className={s.top}>
        <a href="#top" className={s.brand} aria-label="SIENA — back to top">
          <BrandLogo variant="symbol" alt="" className={s.symbol} sizes="32px" priority />
          <BrandLogo variant="wordmark" alt="SIENA" className={s.word} sizes="100px" priority feather={false} />
        </a>
        <p className={s.status} aria-hidden="true"><span /> Core online · v2026</p>
        <nav aria-label="Primary" className={s.nav}>
          <a href="#what">[01] System</a>
          <a href="#solutions">[02] Modules</a>
          <a href="#why">[03] Why</a>
        </nav>
        <a href="#contact" className={s.topCta}>Initiate</a>
      </header>

      <main id="top">
        <Genesis
          variant="flux"
          palette={PALETTE}
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
        <Sections s={s} whatTitle="Three layers. One intelligent core." />
      </main>
      <p className={s.sr}>{SITE.name}</p>
    </div>
  );
}
