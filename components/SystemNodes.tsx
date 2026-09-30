/**
 * SystemNodes — labelled nodes joined by network lines.
 * Used for the 1990s department chain (FINANCE → OPERATIONS → SALES → INVENTORY → MANAGEMENT).
 */
type Node = { label: string; x: number; y: number };

export const DEPARTMENT_CHAIN: Node[] = [
  { label: "Finance", x: 610, y: 190 },
  { label: "Operations", x: 790, y: 120 },
  { label: "Sales", x: 970, y: 190 },
  { label: "Inventory", x: 1150, y: 120 },
  { label: "Management", x: 1330, y: 190 },
];

export function NodePill({ x, y, label, tone = "#8cb0e8", w }: { x: number; y: number; label: string; tone?: string; w?: number }) {
  const width = w ?? Math.max(96, label.length * 9.2 + 34);
  return (
    <g transform={`translate(${x} ${y})`} data-node>
      <rect x={-width / 2} y="-17" width={width} height="34" rx="17" fill="#0a1424" fillOpacity="0.82" stroke={tone} strokeOpacity="0.7" />
      <circle cx={-width / 2 + 16} cy="0" r="4" fill={tone} />
      <text x={8} y="4.5" textAnchor="middle" fontSize="12.5" letterSpacing="0.14em" fill="#e8efff" fontFamily="var(--font-text), sans-serif">
        {label.toUpperCase()}
      </text>
    </g>
  );
}

export function SystemNodes({ nodes = DEPARTMENT_CHAIN, tone = "#8cb0e8" }: { nodes?: Node[]; tone?: string }) {
  return (
    <g data-system-nodes>
      <g fill="none" stroke={tone} strokeWidth="2" strokeOpacity="0.8">
        {nodes.slice(1).map((n, i) => {
          const a = nodes[i];
          const mx = (a.x + n.x) / 2;
          return <path key={n.label} data-link d={`M${a.x} ${a.y} C${mx} ${a.y} ${mx} ${n.y} ${n.x} ${n.y}`} />;
        })}
      </g>
      {nodes.map((n) => (
        <NodePill key={n.label} {...n} tone={tone} />
      ))}
    </g>
  );
}
