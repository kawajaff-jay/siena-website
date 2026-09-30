/**
 * Thread — the recurring line. Ink stroke → ledger line → typed line → data → spreadsheet → network
 * → cloud stream → workflow → AI connection → SIENA light → the autonomous flow.
 * A single open path (plus a blurred twin for glow) that MorphSVG carries across every era.
 */
import { THREAD_PATHS, type ThreadKey } from "@/lib/geometry";

export function Thread({ shape = "ink", d: override, color = "#2b170a", glow = 0 }: { shape?: ThreadKey; d?: string; color?: string; glow?: number }) {
  const d = override ?? THREAD_PATHS[shape];
  return (
    <g data-thread-group style={{ pointerEvents: "none" }}>
      <path data-thread-glow d={d} fill="none" stroke="#3a86ff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity={glow} className="thread-glow" />
      <path data-thread d={d} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}
