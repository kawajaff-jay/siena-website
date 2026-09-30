/**
 * Fragmentation — 2020 → 2025.
 * Separate business platforms pile up on the same desk in three waves (≈2021, ≈2023, ≈2025):
 * each window is useful on its own, but together they become duplicated, noisy and disconnected.
 * In 2026 (choreography `ai`) the same windows are cleaned up and converge into SIENA.
 *
 * Accent elements carry `data-accent="fill|stroke"` so the many product colours can be drained
 * into SIENA blue during the convergence.
 */
import type { ReactNode } from "react";

type Kind = "ledger" | "pipeline" | "campaign" | "tickets" | "ops" | "stock" | "chart" | "chat" | "sheet";

export type FragWindow = {
  id: string;
  label: string;
  kind: Kind;
  accent: string;
  /** index into AI_NODES (0 finance, 1 sales, 2 service, 3 operations, 4 marketing, 5 data); -1 = duplicate */
  node: number;
  /** 1 ≈ 2021 · 2 ≈ 2023 · 3 ≈ 2025 */
  wave: 1 | 2 | 3;
  x: number;
  y: number;
  r: number;
  badge?: number;
};

export const W = 214;
export const H = 132;

export const FRAG_WINDOWS: FragWindow[] = [
  // 2021 — several business platforms
  { id: "finance", label: "Finance · Invoices", kind: "ledger", accent: "#3fcf94", node: 0, wave: 1, x: 640, y: 118, r: -2, badge: 3 },
  { id: "crm", label: "CRM · Sales pipeline", kind: "pipeline", accent: "#ff9f43", node: 1, wave: 1, x: 905, y: 64, r: 1.5, badge: 7 },
  { id: "comms", label: "Team chat", kind: "chat", accent: "#8a9dff", node: 2, wave: 1, x: 1172, y: 104, r: 2, badge: 12 },
  { id: "ops", label: "Operations", kind: "ops", accent: "#4fd1ff", node: 3, wave: 1, x: 1318, y: 292, r: -2, badge: 2 },
  // 2023 — more integrations and dashboards
  { id: "marketing", label: "Marketing · Campaigns", kind: "campaign", accent: "#e667d6", node: 4, wave: 2, x: 598, y: 322, r: 2, badge: 4 },
  { id: "service", label: "Customer Service", kind: "tickets", accent: "#ffd166", node: 2, wave: 2, x: 842, y: 286, r: -2.5, badge: 9 },
  { id: "analytics", label: "Analytics", kind: "chart", accent: "#ff7a85", node: 5, wave: 2, x: 1080, y: 250, r: -1.5, badge: 1 },
  { id: "inventory", label: "Inventory", kind: "stock", accent: "#a88bff", node: 3, wave: 2, x: 1236, y: 452, r: -2.5, badge: 5 },
  // 2025 — maximum fragmentation: duplicated data, exports, copies
  { id: "dup-customers", label: "Customers (copy)", kind: "sheet", accent: "#ff9f43", node: -1, wave: 3, x: 756, y: 468, r: 3.5 },
  { id: "dup-report", label: "sales_report_v7_FINAL.xlsx", kind: "sheet", accent: "#3fcf94", node: -1, wave: 3, x: 1004, y: 432, r: -3 },
  { id: "dup-leads", label: "Leads — Marketing export", kind: "sheet", accent: "#e667d6", node: -1, wave: 3, x: 1372, y: 30, r: 4 },
];

const center = (w: FragWindow) => [w.x + W / 2, w.y + H / 2] as const;
const byId = (id: string) => FRAG_WINDOWS.find((w) => w.id === id)!;

/** Point-to-point integrations: tangled while fragmented; `straight` is the tidy route they straighten into in 2026. */
export const FRAG_LINKS: { a: string; b: string; wave: 2 | 3; broken?: boolean; bend: number }[] = [
  { a: "crm", b: "finance", wave: 2, bend: -70 },
  { a: "crm", b: "marketing", wave: 2, bend: 90 },
  { a: "service", b: "crm", wave: 2, bend: -60 },
  { a: "inventory", b: "ops", wave: 2, bend: 50 },
  { a: "analytics", b: "finance", wave: 2, bend: 80 },
  { a: "comms", b: "service", wave: 3, bend: 70 },
  { a: "analytics", b: "crm", wave: 3, bend: -90, broken: true },
  { a: "inventory", b: "finance", wave: 3, bend: 120, broken: true },
  { a: "marketing", b: "analytics", wave: 3, bend: -110 },
];

export function linkPaths(l: (typeof FRAG_LINKS)[number]) {
  const [ax, ay] = center(byId(l.a));
  const [bx, by] = center(byId(l.b));
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const nx = -(by - ay);
  const ny = bx - ax;
  const len = Math.hypot(nx, ny) || 1;
  const cx1 = mx + (nx / len) * l.bend + (ax - mx) * 0.3;
  const cy1 = my + (ny / len) * l.bend + (ay - my) * 0.3;
  const cx2 = mx - (nx / len) * l.bend * 0.6 + (bx - mx) * 0.3;
  const cy2 = my - (ny / len) * l.bend * 0.6 + (by - my) * 0.3;
  const tangled = `M${ax} ${ay} C${cx1.toFixed(1)} ${cy1.toFixed(1)} ${cx2.toFixed(1)} ${cy2.toFixed(1)} ${bx} ${by}`;
  const straight = `M${ax} ${ay} C${(ax + (bx - ax) / 3).toFixed(1)} ${(ay + (by - ay) / 3).toFixed(1)} ${(ax + (2 * (bx - ax)) / 3).toFixed(1)} ${(ay + (2 * (by - ay)) / 3).toFixed(1)} ${bx} ${by}`;
  return { tangled, straight, mid: [mx, my] as const };
}

const ALERTS: { text: string; x: number; y: number; wave: 2 | 3 }[] = [
  { text: "Sync failed · 14 records", x: 1010, y: 216, wave: 3 },
  { text: "Duplicate customer found", x: 700, y: 452, wave: 3 },
  { text: "3 logins expired", x: 1180, y: 84, wave: 2 },
  { text: "Totals don’t match: CRM ≠ Finance", x: 868, y: 604, wave: 3 },
];

/* ─────────────── window contents (small, readable-at-a-glance, not real text) ─────────────── */

function Body({ w }: { w: FragWindow }): ReactNode {
  const a = w.accent;
  const soft = "#9db4e8";
  switch (w.kind) {
    case "ledger":
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(12 ${36 + i * 17})`}>
              <rect width="78" height="6" rx="3" fill={soft} opacity="0.3" />
              <rect x="120" width="34" height="6" rx="3" fill={soft} opacity="0.3" />
              <rect x="166" width="24" height="7" rx="3.5" fill={a} data-accent="fill" opacity={i === 1 ? 0.95 : 0.55} />
            </g>
          ))}
        </g>
      );
    case "pipeline":
      return (
        <g>
          {[0, 1, 2, 3].map((c) => (
            <g key={c} transform={`translate(${10 + c * 49} 34)`}>
              <rect width="44" height="86" rx="5" fill="#132245" />
              {Array.from({ length: 4 - (c % 3) }, (_, i) => (
                <rect key={i} x="4" y={6 + i * 19} width="36" height="14" rx="3" fill={a} data-accent="fill" opacity={0.35 + c * 0.12} />
              ))}
            </g>
          ))}
        </g>
      );
    case "campaign":
      return (
        <g>
          <path d="M12 112 L48 96 L84 102 L120 70 L156 76 L200 44" fill="none" stroke={a} data-accent="stroke" strokeWidth="2.2" />
          <path d="M12 112 L48 96 L84 102 L120 70 L156 76 L200 44 L200 120 L12 120 Z" fill={a} data-accent="fill" opacity="0.14" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={12 + i * 64} y="32" width="56" height="16" rx="4" fill="#132245" />
          ))}
        </g>
      );
    case "tickets":
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(12 ${34 + i * 18})`}>
              <circle cx="5" cy="4" r="4" fill={i < 2 ? "#ff6b7a" : a} data-accent={i < 2 ? undefined : "fill"} />
              <rect x="16" width={110 - i * 8} height="6" rx="3" fill={soft} opacity="0.3" />
              <rect x="150" width="40" height="8" rx="4" fill={a} data-accent="fill" opacity="0.4" />
            </g>
          ))}
        </g>
      );
    case "ops":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${16 + i * 64} 40)`}>
              <circle cx="22" cy="22" r="18" fill="none" stroke="#1d3261" strokeWidth="6" />
              <circle cx="22" cy="22" r="18" fill="none" stroke={a} data-accent="stroke" strokeWidth="6" strokeDasharray={`${40 + i * 25} 200`} transform="rotate(-90 22 22)" />
            </g>
          ))}
          <rect x="16" y="98" width="182" height="8" rx="4" fill="#1d3261" />
          <rect x="16" y="98" width="118" height="8" rx="4" fill={a} data-accent="fill" opacity="0.8" />
        </g>
      );
    case "stock":
      return (
        <g>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect key={i} x={14 + i * 24} y={120 - (18 + ((i * 37) % 70))} width="16" height={18 + ((i * 37) % 70)} rx="3" fill={a} data-accent="fill" opacity={i === 5 ? 0.95 : 0.45} />
          ))}
        </g>
      );
    case "chart":
      return (
        <g>
          <path d="M12 108 C40 100 56 70 84 78 C112 86 124 50 152 46 C172 43 186 58 202 36" fill="none" stroke={a} data-accent="stroke" strokeWidth="2.2" />
          <path d="M12 116 C44 112 70 96 100 100 C130 104 160 84 202 80" fill="none" stroke={soft} strokeOpacity="0.45" strokeWidth="1.6" strokeDasharray="4 4" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={12 + i * 64} y="32" width="56" height="12" rx="3" fill={a} data-accent="fill" opacity="0.25" />
          ))}
        </g>
      );
    case "chat":
      return (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${i % 2 ? 66 : 12} ${34 + i * 22})`}>
              <rect width={i % 2 ? 136 : 120} height="16" rx="8" fill={i % 2 ? a : "#1a2c55"} data-accent={i % 2 ? "fill" : undefined} opacity={i % 2 ? 0.5 : 1} />
            </g>
          ))}
        </g>
      );
    case "sheet":
      return (
        <g>
          <g stroke="#2a3f73" strokeWidth="1">
            {[0, 1, 2, 3, 4, 5].map((i) => <line key={`r${i}`} x1="10" x2="204" y1={34 + i * 16} y2={34 + i * 16} />)}
            {[0, 1, 2, 3, 4].map((i) => <line key={`c${i}`} y1="34" y2="114" x1={10 + i * 48.5} x2={10 + i * 48.5} />)}
          </g>
          <rect x="10" y="34" width="194" height="16" fill={a} data-accent="fill" opacity="0.28" />
          <rect x="107" y="66" width="48" height="16" fill="#ff6b7a" opacity="0.35" />
        </g>
      );
  }
}

export function FragWindowView({ w }: { w: FragWindow }) {
  return (
    <g transform={`translate(${w.x} ${w.y})`}>
      <rect width={W} height={H} rx="10" fill="#0a152e" fillOpacity="0.92" stroke={w.accent} data-accent="stroke" strokeOpacity="0.45" />
      <rect width={W} height="24" rx="10" fill="#122347" />
      <rect y="14" width={W} height="10" fill="#122347" />
      <rect x="10" y="9" width="6" height="6" rx="1.5" fill={w.accent} data-accent="fill" />
      <text x="24" y="16" fill="#d5e0ff" fontSize="10" fontFamily="var(--font-text), sans-serif" letterSpacing="0.03em">{w.label}</text>
      <Body w={w} />
    </g>
  );
}

export function FragmentedSystems() {
  return (
    <g data-frag>
      {/* integrations: tangled point-to-point connections, some broken */}
      <g fill="none" strokeWidth="1.5" strokeLinecap="round" data-frag-links>
        {FRAG_LINKS.map((l, i) => {
          const p = linkPaths(l);
          return (
            <path
              key={i}
              d={p.tangled}
              data-link={i}
              data-wave={l.wave}
              data-straight={p.straight}
              data-broken={l.broken ? "" : undefined}
              stroke={l.broken ? "#ff6b7a" : "#8fb0ff"}
              strokeOpacity={l.broken ? 0.75 : 0.55}
              strokeDasharray={l.broken ? "6 7" : "3 5"}
            />
          );
        })}
      </g>
      {FRAG_WINDOWS.map((w, i) => (
        <g key={w.id} data-fwin={i} data-wave={w.wave} data-target={w.node} data-dup={w.node < 0 ? "" : undefined} transform={`rotate(${w.r} ${w.x + W / 2} ${w.y + H / 2})`}>
          <FragWindowView w={w} />
          {w.badge !== undefined && (
            <g transform={`translate(${w.x + W - 4} ${w.y - 4})`} data-badge data-wave={w.wave === 1 ? 2 : 3}>
              <circle r="10.5" fill="#ff5d6c" />
              <text y="4" textAnchor="middle" fontSize="10.5" fill="#fff" fontFamily="var(--font-text), sans-serif">{w.badge}</text>
            </g>
          )}
        </g>
      ))}
      {/* alerts */}
      <g data-alerts>
        {ALERTS.map((a) => {
          const width = a.text.length * 6.1 + 34;
          return (
            <g key={a.text} transform={`translate(${a.x} ${a.y})`} data-alert data-wave={a.wave}>
              <rect width={width} height="26" rx="13" fill="#2a0f1e" fillOpacity="0.92" stroke="#ff6b7a" strokeOpacity="0.8" />
              <circle cx="13" cy="13" r="4" fill="#ff6b7a" />
              <text x="24" y="17" fontSize="10.5" fill="#ffd9de" fontFamily="var(--font-text), sans-serif">{a.text}</text>
            </g>
          );
        })}
      </g>
    </g>
  );
}
