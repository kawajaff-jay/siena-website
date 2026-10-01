/**
 * SolutionVisual — the small, quiet drawing inside each Solutions module.
 * Pure SVG + CSS: a slow idle loop while the module is on screen, a livelier pass on hover/tap.
 * Classes: .sv-flow = travelling dashes along a path · .sv-dot = a pulse moving along · .sv-bar = growing bars
 * · .sv-node = nodes lighting in sequence (--i sets the order) · .sv-ring = expanding signal rings.
 */
type Kind = "finance" | "sales" | "service" | "operations" | "marketing" | "analytics" | "automation" | "ai";

export function SolutionVisual({ kind }: { kind: Kind }) {
  return (
    <svg className={`sv sv--${kind}`} viewBox="0 0 120 64" aria-hidden="true" focusable="false">
      {VISUALS[kind]}
    </svg>
  );
}

const n = (i: number) => ({ ["--i" as string]: i }) as React.CSSProperties;

const VISUALS: Record<Kind, React.ReactNode> = {
  // invoice → reconciled → chart
  finance: (
    <>
      <rect className="sv-line" x="6" y="14" width="22" height="30" rx="2.5" />
      <path className="sv-faint" d="M11 22h12M11 28h12M11 34h8" />
      <path className="sv-flow" d="M32 29 H52" />
      <path className="sv-faint" d="M58 52 H114" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} className="sv-bar" style={n(i)} x={62 + i * 10} y={52 - (12 + i * 6 + (i === 2 ? -4 : 0))} width="6" height={12 + i * 6 + (i === 2 ? -4 : 0)} rx="1.5" />
      ))}
      <path className="sv-line sv-trend" d="M62 40 L72 36 L82 37 L92 26 L102 22 L112 14" />
    </>
  ),
  // pipeline stages narrowing to a won deal
  sales: (
    <>
      <path className="sv-faint" d="M8 12 H112 L92 52 H28 Z" />
      <path className="sv-faint" d="M34 12 L40 52 M60 12 V52 M86 12 L80 52" />
      <path className="sv-flow" d="M10 32 H108" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} className="sv-node" style={n(i)} cx={22 + i * 26} cy="32" r="3.2" />
      ))}
      <circle className="sv-dot" r="2.6" style={{ offsetPath: "path('M10 32 H108')" } as React.CSSProperties} />
    </>
  ),
  // a message routed to the right place
  service: (
    <>
      <path className="sv-line" d="M8 14 h30 a4 4 0 0 1 4 4 v12 a4 4 0 0 1 -4 4 h-18 l-6 6 v-6 h-6 a4 4 0 0 1 -4 -4 v-12 a4 4 0 0 1 4 -4z" />
      <path className="sv-faint" d="M14 22h22M14 27h14" />
      <path className="sv-faint" d="M46 26 C 66 26, 70 12, 92 12 M46 26 C 66 26, 70 40, 92 40 M46 26 H92" />
      <path className="sv-flow" d="M46 26 C 66 26, 70 40, 92 40" />
      {[12, 26, 40].map((y, i) => (
        <rect key={y} className={i === 2 ? "sv-node sv-node--on" : "sv-node"} style={n(i)} x="94" y={y - 5} width="20" height="10" rx="3" />
      ))}
    </>
  ),
  // orders, inventory and fulfilment as one connected flow
  operations: (
    <>
      <path className="sv-faint" d="M24 20 L60 32 L96 20 M24 44 L60 32 L96 44" />
      <path className="sv-flow" d="M24 20 L60 32 L96 44" />
      {[
        [24, 20], [24, 44], [60, 32], [96, 20], [96, 44],
      ].map(([x, y], i) => (
        <rect key={i} className="sv-node" style={n(i)} x={x - 7} y={y - 6} width="14" height="12" rx="2.5" />
      ))}
    </>
  ),
  // a campaign signal travelling to revenue
  marketing: (
    <>
      {[0, 1, 2].map((i) => (
        <circle key={i} className="sv-ring" style={n(i)} cx="22" cy="32" r="16" />
      ))}
      <circle className="sv-node sv-node--on" cx="22" cy="32" r="4" />
      <path className="sv-faint" d="M30 32 C 52 32, 60 18, 82 18 H112" />
      <path className="sv-flow" d="M30 32 C 52 32, 60 18, 82 18 H112" />
      <path className="sv-line" d="M96 46 h16 M104 38 v16" />
    </>
  ),
  // a live graph with a data pulse
  analytics: (
    <>
      <path className="sv-faint" d="M6 52 H114 M6 36 H114 M6 20 H114" />
      <path className="sv-area" d="M6 44 L22 38 L36 41 L52 28 L66 32 L82 18 L98 22 L114 10 V52 H6 Z" />
      <path className="sv-line sv-trend" d="M6 44 L22 38 L36 41 L52 28 L66 32 L82 18 L98 22 L114 10" />
      <circle className="sv-dot" r="2.6" style={{ offsetPath: "path('M6 44 L22 38 L36 41 L52 28 L66 32 L82 18 L98 22 L114 10')" } as React.CSSProperties} />
    </>
  ),
  // workflow nodes handing work along
  automation: (
    <>
      <path className="sv-faint" d="M20 32 H100" />
      <path className="sv-flow" d="M20 32 H100" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className="sv-node" style={n(i)}>
          <rect x={10 + i * 30 - 0} y="22" width="20" height="20" rx="5" />
        </g>
      ))}
      <path className="sv-line" d="M15 32 l3 3 l6 -6" />
    </>
  ),
  // an agent choosing the right path
  ai: (
    <>
      <path className="sv-faint" d="M22 32 C 46 32, 50 12, 74 12 M22 32 H74 M22 32 C 46 32, 50 52, 74 52" />
      <path className="sv-flow sv-route" d="M22 32 C 46 32, 50 12, 74 12" />
      <circle className="sv-node sv-node--on" cx="18" cy="32" r="6" />
      {[12, 32, 52].map((y, i) => (
        <circle key={y} className="sv-node" style={n(i)} cx="80" cy={y} r="4.5" />
      ))}
      <path className="sv-faint" d="M86 12 H112 M86 32 H104 M86 52 H108" />
    </>
  ),
};
