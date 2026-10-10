import Link from "next/link";
import s from "../preview/preview.module.css";
import { CURSOR_DESIGNS } from "./designs";

export default function CursorPreviewIndex() {
  return (
    <main className={s.index}>
      <p className={s.kicker}>SIENA · cursor previews</p>
      <h1 className={s.title}>A subtle cursor for the hero</h1>
      <p className={s.lead}>
        Three quiet replacements for the targeting square. Open one and move your mouse over the hero. On phones there is no
        cursor, so these only show on desktop.
      </p>
      <ul className={s.grid}>
        {CURSOR_DESIGNS.map((d) => (
          <li key={d.v}>
            <Link href={`/preview-cursor/${d.v}`} className={s.card}>
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
