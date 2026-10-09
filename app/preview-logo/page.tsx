import Link from "next/link";
import s from "../preview/preview.module.css";
import { LOGO_DESIGNS } from "./designs";

export default function LogoPreviewIndex() {
  return (
    <main className={s.index}>
      <p className={s.kicker}>SIENA · logo interlude previews</p>
      <h1 className={s.title}>A pause between reading</h1>
      <p className={s.lead}>
        Simple, catchy moments with the SIENA logo, placed after the About section to give visitors a break before the
        solutions. Each page opens on the full homepage, scrolled to the logo.
      </p>
      <ul className={s.grid}>
        {LOGO_DESIGNS.map((d) => (
          <li key={d.v}>
            <Link href={`/preview-logo/${d.v}#interlude`} className={s.card}>
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
