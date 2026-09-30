/** EraLabel — year · era name · one powerful sentence · keywords. Real HTML, always. */
import type { Era } from "@/content/eras";

export function EraLabel({ era, as = "stage" }: { era: Era; as?: "stage" | "chronicle" }) {
  const pos = era.copy ?? "left";
  return (
    <article className={`era-label era-label--${as} era-label--${pos}`} data-copy={era.id} aria-labelledby={`${as}-${era.id}-title`}>
      <h2 className="era-title" id={`${as}-${era.id}-title`}>
        <span className="era-years">{era.years}</span>
        <span className="era-name">{era.title}</span>
      </h2>
      <div className="era-statements">
        <p className="era-statement" data-statement>
          {era.statement}
        </p>
        {era.beats?.map((b) => (
          <p key={b} className="era-statement era-statement--beat" data-beat>
            {b}
          </p>
        ))}
      </div>
      {era.lead && (
        <p className="era-lead" data-lead>
          {era.lead}
        </p>
      )}
      <ul className="era-keywords" aria-label="Key concepts">
        {era.keywords.map((k) => (
          <li key={k} data-kw>
            {k}
          </li>
        ))}
      </ul>
    </article>
  );
}
