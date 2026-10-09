import Link from "next/link";
import s from "../preview/preview.module.css";
import { CORE_DESIGNS } from "./designs";

export default function CorePreviewIndex() {
  return (
    <main className={s.index}>
      <p className={s.kicker}>SIENA · energy core previews</p>
      <h1 className={s.title}>Four ways to charge the S</h1>
      <p className={s.lead}>
        Each design replaces the system diagram in the About section with the SIENA symbol vibrating with energy. Move your
        cursor closer to charge it and click to send a surge. Each page opens on the full homepage, scrolled to that section.
      </p>
      <ul className={s.grid}>
        {CORE_DESIGNS.map((d) => (
          <li key={d.v}>
            <Link href={`/preview-core/${d.v}#what`} className={s.card}>
              <span className={s.swatches} aria-hidden="true">
                {d.swatch.map((c) => <span key={c} style={{ background: c }} />)}
              </span>
              <span className={s.cardMood}>{d.mood}</span>
              <span className={s.cardName}>{d.n} · {d.name}</span>
              <span className={s.cardText}>{d.text}</span>
              <span className={s.cardGo}>Open preview →</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
