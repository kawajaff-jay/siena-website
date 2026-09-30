"use client";
/** ScrollProgress — the time machine's dial: live year readout + keyboard-navigable era rail. */
import { ERAS } from "@/content/eras";

export function ScrollProgress({ onJump }: { onJump: (index: number) => void }) {
  return (
    <nav className="progress" aria-label="Eras">
      <p className="progress-year" aria-hidden="true">
        <span data-year>c. 762</span>
        <span className="progress-era" data-year-suffix>
          CE
        </span>
      </p>
      <div className="progress-rail">
        <span className="progress-fill" data-progress-fill />
        <ol>
          {ERAS.map((e, i) => (
            <li key={e.id}>
              <button type="button" data-rail={i} onClick={() => onJump(i)} aria-label={`${e.years} — ${e.title}`}>
                <span className="progress-dot" aria-hidden="true" />
                <span className="progress-label">{e.railLabel}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
