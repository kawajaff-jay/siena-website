import { SOLUTIONS } from "@/content/site";

export function Solutions() {
  return (
    <section className="solutions" id="solutions" aria-labelledby="solutions-heading">
      <div className="container">
        <p className="eyebrow">{SOLUTIONS.eyebrow}</p>
        <h2 id="solutions-heading" className="section-title">
          {SOLUTIONS.headline}
        </h2>
        <ul className="solutions-grid">
          {SOLUTIONS.items.map((s, i) => (
            <li key={s.title} className="solution">
              <span className="solution-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
