/**
 * AIConvergence — 2026.
 * Separate systems converge into one intelligence: six department nodes, lines drawn into the centre,
 * the thread traces the SIENA symbol, and the OFFICIAL logo asset resolves exactly on top of the trace.
 */
import { AI_NODES, LOCKUP, SIENA_BLADE_LOWER, SIENA_BLADE_UPPER, SYMBOL } from "@/lib/geometry";
import { AI_SYSTEMS } from "@/content/eras";
import { NodePill } from "./SystemNodes";
import { asset } from "@/lib/asset";

export function AIConvergenceBackground() {
  return (
    <g>
      <rect x="-200" y="-100" width="2000" height="660" fill="#040914" />
      <g fill="none" stroke="#2f7bff" strokeOpacity="0.1">
        <ellipse cx={SYMBOL.cx} cy={SYMBOL.cy} rx="260" ry="260" />
        <ellipse cx={SYMBOL.cx} cy={SYMBOL.cy} rx="420" ry="300" strokeDasharray="2 8" />
        <ellipse cx={SYMBOL.cx} cy={SYMBOL.cy} rx="600" ry="380" strokeOpacity="0.06" />
      </g>
    </g>
  );
}

export function AIConvergence() {
  const { cx, cy } = SYMBOL;
  return (
    <g data-ai>
      <ellipse cx={cx} cy={cy} rx="380" ry="320" fill="url(#g-blue)" opacity="0.55" data-ai-core />
      <g fill="none" stroke="#3a86ff" strokeWidth="1.6" strokeLinecap="round" data-ai-lines>
        {AI_NODES.map((n) => {
          const mx = (n.x + cx) / 2;
          return <path key={n.id} d={`M${n.x} ${n.y} C${mx} ${n.y} ${cx + (n.x - cx) * 0.2} ${cy + (n.y - cy) * 0.2} ${cx} ${cy}`} />;
        })}
      </g>
      <g data-ai-nodes>
        {AI_NODES.map((n, i) => (
          <NodePill key={n.id} x={n.x} y={n.y} label={AI_SYSTEMS[i]} tone="#4a8dff" />
        ))}
      </g>
      {/* forming fill (from the trace) — dissolves into the real logo */}
      <g data-blades>
        <path d={SIENA_BLADE_UPPER} fill="#2a6dff" opacity="0.55" />
        <path d={SIENA_BLADE_LOWER} fill="#2a6dff" opacity="0.55" />
      </g>
      <SienaLockup />
    </g>
  );
}

/** The official lockup crop placed so its symbol sits exactly on the traced thread. */
export function SienaLockup() {
  return (
    <g data-lockup>
      <g clipPath="url(#clip-lockup)">
        <image
          href={asset("/brand/siena-lockup.webp")}
          x={LOCKUP.x}
          y={LOCKUP.y}
          width={LOCKUP.w}
          height={LOCKUP.h}
          preserveAspectRatio="xMidYMid meet"
        >
          <title>SIENA — AI Solutions &amp; Systems</title>
        </image>
      </g>
    </g>
  );
}

/** Clip used to reveal the wordmark after the symbol has resolved. */
export function LockupDefs() {
  return (
    <>
      <clipPath id="clip-lockup">
        <rect data-lockup-clip x={LOCKUP.x} y={LOCKUP.y} width={LOCKUP.w} height={LOCKUP.h} />
      </clipPath>
    </>
  );
}
