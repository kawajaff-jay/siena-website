/**
 * FutureWorkflow — 2030 and beyond.
 * One seamless intelligent flow instead of separate apps. The SIENA thread becomes the spine;
 * a pulse travels it and each step lights in turn. Human review points are explicit.
 */
import { FLOW_NODES, THREAD_PATHS } from "@/lib/geometry";
import { WORKFLOW_STEPS } from "@/content/eras";

const HUMAN_REVIEW = new Set([4, 7]);

export function FutureWorkflow() {
  return (
    <g data-flow>
      <path d={THREAD_PATHS.flow} fill="none" stroke="#1f3f86" strokeWidth="1" strokeDasharray="3 6" opacity="0.6" />
      {FLOW_NODES.map((n, i) => {
        const above = n.y !== 450;
        return (
          <g key={i} transform={`translate(${n.x} ${n.y})`} data-flow-node>
            <circle r="26" fill="#050b1c" stroke="#3a86ff" strokeOpacity="0.5" />
            <circle r="9" fill="#3a86ff" data-flow-dot />
            <text y={above ? -40 : 50} textAnchor="middle" fontSize="13" letterSpacing="0.12em" fill="#dfe8ff" fontFamily="var(--font-text), sans-serif">
              {WORKFLOW_STEPS[i].toUpperCase()}
            </text>
            <text y={above ? -58 : 68} textAnchor="middle" fontSize="10" letterSpacing="0.2em" fill="#6f95e8" fontFamily="var(--font-text), sans-serif">
              {String(i + 1).padStart(2, "0")}
            </text>
            {HUMAN_REVIEW.has(i) && (
              <g transform={`translate(0 ${above ? 44 : -60})`} data-human>
                <rect x="-62" y="-13" width="124" height="26" rx="13" fill="#0b1630" stroke="#9cc2ff" strokeOpacity="0.6" />
                <circle cx="-44" cy="-3" r="4" fill="#cfe0ff" />
                <path d="M-51 7 Q-44 -1 -37 7 Z" fill="#cfe0ff" />
                <text x="6" y="4" textAnchor="middle" fontSize="10.5" letterSpacing="0.08em" fill="#cfe0ff" fontFamily="var(--font-text), sans-serif">
                  {i === 7 ? "Human decides" : "Human reviews"}
                </text>
              </g>
            )}
          </g>
        );
      })}
      <circle r="7" fill="#fff" data-pulse cx="0" cy="0" style={{ filter: "drop-shadow(0 0 8px #3a86ff)" }} />
    </g>
  );
}
