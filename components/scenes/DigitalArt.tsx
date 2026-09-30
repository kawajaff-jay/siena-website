/**
 * 1990s Enterprise · 2000s Internet · 2010s Cloud & Mobile · 2020–25 Automation
 */
import { AppWindow, Glow, Person } from "./common";
import { APP_WINDOWS } from "@/content/eras";

/* ─────────────────────────── 1990s ─────────────────────────── */

export function EnterpriseBackground() {
  return (
    <g>
      <rect x="-200" y="-100" width="2000" height="660" fill="#1b2a3c" />
      {/* ceiling grid & fluorescent panels */}
      <g stroke="#0f1a27" strokeWidth="2">
        {Array.from({ length: 16 }, (_, i) => (
          <line key={i} x1={-200 + i * 130} y1="-100" x2={-200 + i * 130} y2="40" />
        ))}
        <line x1="-200" y1="40" x2="1800" y2="40" />
      </g>
      {[300, 820, 1340].map((x) => (
        <rect key={x} x={x} y="0" width="200" height="22" fill="#dfe9ff" opacity="0.35" />
      ))}
      {/* cubicle partitions */}
      <path d="M-200 330 L1800 330 L1800 560 L-200 560 Z" fill="#46566b" />
      <path d="M-200 330 L1800 330" stroke="#8793a3" strokeWidth="6" />
      <g stroke="#3a485a" strokeWidth="3">
        {[260, 680, 1240, 1560].map((x) => (
          <line key={x} x1={x} y1="330" x2={x} y2="560" />
        ))}
      </g>
      {/* colleagues across the partitions */}
      <g opacity="0.8">
        <Person x={1400} y={420} s={0.62} fill="#131c28" opacity={1} />
        <Person x={560} y={410} s={0.6} fill="#131c28" opacity={1} />
      </g>
      <rect x="1300" y="250" width="70" height="60" fill="#c9c2ad" opacity="0.4" />
    </g>
  );
}

export function EnterpriseObjects() {
  return (
    <g>
      <Glow cx={960} cy={460} rx={360} ry={240} kind="blue" opacity={0.35} />
      {/* beige CRT with spreadsheet */}
      <g transform="translate(960 450)">
        <path d="M-150 -120 L150 -120 L150 110 L-150 110 Z" fill="#cfc8b4" />
        <rect x="-126" y="-96" width="252" height="186" rx="6" fill="#f4f6f8" />
        <rect x="-126" y="-96" width="252" height="14" fill="#1f3f86" />
        <rect x="-126" y="-82" width="252" height="10" fill="#c8ccd4" />
        <g stroke="#b9c0cc" strokeWidth="0.8">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1="-126" x2="126" y1={-72 + i * 13.5} y2={-72 + i * 13.5} />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={i} y1="-72" y2="90" x1={-100 + i * 36} x2={-100 + i * 36} />
          ))}
        </g>
        <g fill="#344" opacity="0.55">
          {Array.from({ length: 5 }, (_, r) =>
            Array.from({ length: 6 }, (_, c) => <rect key={`${r}-${c}`} x={-96 + c * 36} y={-68 + r * 13.5} width={18 + ((r + c) % 3) * 4} height="4" />),
          )}
        </g>
        <rect x="-40" y="110" width="80" height="26" fill="#bdb6a2" />
      </g>
      {/* tower */}
      <g transform="translate(1270 470)">
        <rect x="-50" y="-120" width="100" height="210" fill="#d4cdb9" />
        <rect x="-38" y="-100" width="76" height="12" fill="#9d977f" />
        <rect x="-38" y="-80" width="76" height="12" fill="#9d977f" />
        <rect x="-30" y="-50" width="60" height="4" fill="#555" />
        <circle cx="24" cy="60" r="5" fill="#46ff97" />
      </g>
      {/* keyboard + mouse */}
      <g transform="translate(960 700)">
        <path d="M-180 -30 L180 -30 L204 36 L-204 36 Z" fill="#d7d0bc" />
        <g fill="#b9b19b">
          {Array.from({ length: 4 }, (_, r) =>
            Array.from({ length: 15 }, (_, k) => <rect key={`${r}-${k}`} x={-170 - r * 6 + k * (23 + r * 0.8)} y={-24 + r * 14} width="18" height="10" rx="2" />),
          )}
        </g>
      </g>
      <g transform="translate(1200 720)">
        <ellipse cx="0" cy="0" rx="22" ry="30" fill="#ddd6c2" />
        <path d="M0 -30 Q-30 -70 20 -120" stroke="#888" strokeWidth="2" fill="none" />
      </g>
      {/* floppy disks */}
      <g transform="translate(700 760) rotate(-8)">
        <rect x="-36" y="-36" width="72" height="72" fill="#1d2230" />
        <rect x="-20" y="-36" width="40" height="22" fill="#9aa3b3" />
        <rect x="-26" y="4" width="52" height="30" fill="#e6e9ef" />
      </g>
      <g transform="translate(760 790) rotate(10)">
        <rect x="-36" y="-36" width="72" height="72" fill="#27447a" />
        <rect x="-20" y="-36" width="40" height="22" fill="#9aa3b3" />
      </g>
    </g>
  );
}

/* ─────────────────────────── 2000s ─────────────────────────── */

export function InternetBackground() {
  return (
    <g>
      <rect x="-200" y="-100" width="2000" height="660" fill="#08183a" />
    </g>
  );
}

/** The global network sphere — a live overlay, so it also works on top of a photographic plate. */
export function InternetGlobe() {
  const lats = [-60, -30, 0, 30, 60];
  const lons = [-75, -45, -15, 15, 45, 75];
  const R = 300;
  return (
    <g opacity="0.5">
      <g transform="translate(960 330)" data-globe>
        <circle r={R} fill="#0d2a66" opacity="0.12" />
        <circle r={R} fill="none" stroke="#5b95ff" strokeOpacity="0.45" />
        <g fill="none" stroke="#5b95ff" strokeOpacity="0.25">
          {lats.map((l) => {
            const y = R * Math.sin((l * Math.PI) / 180);
            const rx = R * Math.cos((l * Math.PI) / 180);
            return <ellipse key={l} cx="0" cy={y} rx={rx} ry={rx * 0.12} />;
          })}
          {lons.map((l) => (
            <ellipse key={l} cx="0" cy="0" rx={Math.abs(R * Math.sin((l * Math.PI) / 180))} ry={R} />
          ))}
        </g>
        {/* trade arcs: the same routes Abbasid caravans travelled, now at light speed */}
        <g fill="none" stroke="#8fc0ff" strokeWidth="1.5" strokeOpacity="0.7" data-arcs>
          <path d="M-160 -60 Q-40 -220 120 -90" />
          <path d="M-220 60 Q0 -80 200 40" />
          <path d="M-60 120 Q60 20 230 -40" />
          <path d="M40 -160 Q120 -40 90 150" />
        </g>
        {/* by 2007 the network is denser: more routes light up, and data pulses travel along them */}
        <g fill="none" stroke="#a9d0ff" strokeWidth="1.3" strokeOpacity="0.75" data-arcs-late>
          <path d="M-250 -10 Q-120 -200 60 -170" />
          <path d="M-120 170 Q40 60 250 90" />
          <path d="M150 -180 Q260 -60 230 -40" />
          <path d="M-200 -120 Q-60 -40 10 -20" />
          <path d="M10 -20 Q150 60 90 150" />
          <path d="M-270 110 Q-150 -10 -60 120" />
        </g>
        <g fill="#e2efff" data-pulses>
          {[0, 1, 2, 3].map((i) => <circle key={i} r="3.5" opacity="0" />)}
        </g>
        <g fill="#cfe2ff">
          {[[-160, -60], [120, -90], [-220, 60], [200, 40], [-60, 120], [230, -40], [40, -160], [90, 150], [10, -20]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="4" />
          ))}
        </g>
      </g>
    </g>
  );
}

export function InternetObjects() {
  return (
    <g>
      <Glow cx={960} cy={470} rx={380} ry={240} kind="blue" opacity={0.5} />
      <g transform="translate(960 460)">
        <rect x="-180" y="-124" width="360" height="228" rx="8" fill="#b9c0cc" />
        <rect x="-170" y="-114" width="340" height="208" fill="#f5f7fb" />
        {/* browser chrome */}
        <rect x="-170" y="-114" width="340" height="30" fill="#dfe4ee" />
        <circle cx="-156" cy="-99" r="4" fill="#9aa3b3" />
        <rect x="-140" y="-106" width="240" height="14" rx="7" fill="#fff" />
        <text x="-132" y="-96" fontSize="9" fill="#4a5568" fontFamily="var(--font-text), sans-serif">https://store.example</text>
        {/* shop */}
        <rect x="-170" y="-84" width="340" height="24" fill="#1f5fd1" />
        <g>
          {[-150, -52, 46].map((x, i) => (
            <g key={x}>
              <rect x={x} y="-48" width="86" height="64" fill="#e6ecf7" />
              <rect x={x + 8} y="22" width="50" height="5" fill="#556" opacity="0.5" />
              <rect x={x + 8} y="32" width={i === 1 ? 70 : 40} height="14" rx="3" fill="#ff9d2e" />
            </g>
          ))}
        </g>
        <path d="M-50 104 L50 104 L70 136 L-70 136 Z" fill="#9aa3b3" />
      </g>
      <g transform="translate(960 710)">
        <path d="M-170 -26 L170 -26 L190 30 L-190 30 Z" fill="#c3c9d4" />
      </g>
      {/* flip phone & bank card */}
      <g transform="translate(1230 740) rotate(-12)">
        <rect x="-22" y="-44" width="44" height="88" rx="10" fill="#707a8a" />
        <rect x="-16" y="-36" width="32" height="30" rx="3" fill="#6fb4ff" />
      </g>
      <g transform="translate(690 770) rotate(8)">
        <rect x="-54" y="-34" width="108" height="68" rx="8" fill="#1f3a8a" />
        <rect x="-40" y="-14" width="22" height="16" rx="2" fill="url(#g-brass)" />
        <rect x="-40" y="14" width="80" height="5" fill="#cfe2ff" opacity="0.6" />
      </g>
    </g>
  );
}

/* ─────────────────────────── 2010s ─────────────────────────── */

export function CloudBackground() {
  return (
    <g>
      <rect x="-200" y="-100" width="2000" height="660" fill="#0b2f47" />
      {/* glass wall */}
      <g stroke="#9fefff" strokeOpacity="0.12">
        {[300, 620, 940, 1260, 1580].map((x) => (
          <line key={x} x1={x} x2={x} y1="-100" y2="560" strokeWidth="3" />
        ))}
      </g>
      {/* clouds */}
      <g fill="none" stroke="#bff4ff" strokeOpacity="0.6" strokeWidth="2">
        <path d="M1100 250 a40 40 0 0 1 40 -48 a56 56 0 0 1 104 0 a40 40 0 0 1 10 48 Z" />
        <path d="M660 190 a28 28 0 0 1 28 -34 a40 40 0 0 1 74 0 a28 28 0 0 1 8 34 Z" strokeOpacity="0.35" />
      </g>
      {/* data streams */}
      <g stroke="#7fe3ff" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" data-streams>
        {[700, 780, 1180, 1300, 1420].map((x, i) => (
          <line key={x} x1={x} x2={x + (i % 2 ? 20 : -20)} y1="540" y2={240 + (i % 3) * 30} opacity="0.55" />
        ))}
      </g>
      {/* API brackets */}
      <text x="1330" y="140" fill="#9fefff" opacity="0.35" fontSize="34" fontFamily="ui-monospace, monospace">{"{ }"}</text>
      <text x="700" y="330" fill="#9fefff" opacity="0.25" fontSize="22" fontFamily="ui-monospace, monospace">/api/v2</text>
    </g>
  );
}

export function Laptop({ screen = "dashboard" }: { screen?: "dashboard" | "blank" }) {
  return (
    <g transform="translate(960 560)">
      <path d="M-150 -170 L150 -170 L150 20 L-150 20 Z" fill="#9aa4b1" />
      <rect x="-140" y="-160" width="280" height="170" fill="#0c1b33" />
      {screen === "dashboard" && (
        <g>
          <rect x="-130" y="-150" width="80" height="150" fill="#12284a" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="-122" y={-140 + i * 18} width="60" height="8" rx="3" fill="#7fe3ff" opacity={i === 0 ? 0.8 : 0.3} />
          ))}
          <rect x="-40" y="-150" width="80" height="44" rx="4" fill="#12284a" />
          <rect x="50" y="-150" width="80" height="44" rx="4" fill="#12284a" />
          <text x="-32" y="-120" fontSize="16" fill="#e8fbff" fontFamily="var(--font-text), sans-serif">+24%</text>
          <text x="58" y="-120" fontSize="16" fill="#e8fbff" fontFamily="var(--font-text), sans-serif">1,284</text>
          <rect x="-40" y="-96" width="170" height="92" rx="4" fill="#12284a" />
          <path d="M-30 -20 L0 -40 L30 -34 L60 -64 L90 -56 L120 -84" stroke="#7fe3ff" strokeWidth="2.5" fill="none" />
        </g>
      )}
      <path d="M-190 20 L190 20 L206 40 L-206 40 Z" fill="#b8c1cd" />
    </g>
  );
}

export function CloudObjects() {
  return (
    <g>
      <Glow cx={960} cy={480} rx={420} ry={260} kind="cyan" opacity={0.6} />
      <Laptop />
      {/* smartphone */}
      <g transform="translate(1250 730) rotate(-10)">
        <rect x="-30" y="-58" width="60" height="116" rx="10" fill="#1b2330" />
        <rect x="-25" y="-50" width="50" height="100" rx="4" fill="#0c1b33" />
        <rect x="-19" y="-42" width="38" height="20" rx="3" fill="#7fe3ff" opacity="0.6" />
        <rect x="-19" y="-16" width="38" height="8" rx="3" fill="#7fe3ff" opacity="0.3" />
        <rect x="-19" y="-4" width="26" height="8" rx="3" fill="#7fe3ff" opacity="0.3" />
      </g>
      {/* tablet */}
      <g transform="translate(660 740) rotate(6)">
        <rect x="-92" y="-62" width="184" height="124" rx="10" fill="#1b2330" />
        <rect x="-84" y="-54" width="168" height="108" rx="4" fill="#0c1b33" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={-70 + i * 24} y={30 - [30, 46, 22, 60, 40, 70][i]} width="14" height={[30, 46, 22, 60, 40, 70][i]} fill="#7fe3ff" opacity="0.55" />
        ))}
      </g>
      {/* coffee */}
      <g transform="translate(1390 700)">
        <path d="M-26 -30 L26 -30 L20 30 L-20 30 Z" fill="#e8ecf2" />
        <rect x="-28" y="-40" width="56" height="12" rx="4" fill="#27313f" />
      </g>
    </g>
  );
}

/* ─────────────────────────── 2020–2025 ─────────────────────────── */

/** Clutter layout for the ten app windows (x, y, rotation). */
export const WINDOW_LAYOUT: [number, number, number][] = [
  [600, 90, -4], [860, 40, 2], [1130, 70, 3], [1360, 180, -3], [560, 300, 3],
  [1250, 330, -2], [760, 210, -2], [1010, 200, 4], [690, 430, 2], [1360, 470, -4],
];

export function AutomationBackground() {
  return (
    <g>
      <rect x="-200" y="-100" width="2000" height="660" fill="#09142d" />
      <g stroke="#3d6fff" strokeOpacity="0.08">
        {Array.from({ length: 20 }, (_, i) => (
          <line key={i} x1={-200 + i * 100} x2={-200 + i * 100} y1="-100" y2="560" />
        ))}
      </g>
    </g>
  );
}

export function AutomationWindows() {
  return (
    <g data-windows>
      {APP_WINDOWS.map((name, i) => {
        const [x, y, r] = WINDOW_LAYOUT[i];
        return (
          <g key={name} data-window={i} transform={`rotate(${r} ${x + 100} ${y + 62})`}>
            <AppWindow x={x} y={y} title={name} />
            <g transform={`translate(${x + 188} ${y - 6})`} data-badge>
              <circle r="10" fill="#ff5d6c" />
              <text y="4" textAnchor="middle" fontSize="11" fill="#fff" fontFamily="var(--font-text), sans-serif">{(i * 3) % 9 + 1}</text>
            </g>
            {i % 3 === 0 && (
              <g transform={`translate(${x + 40} ${y + 82})`}>
                <rect width="120" height="26" rx="6" fill="#1b2a52" stroke="#6f8fd8" strokeOpacity="0.5" />
                <text x="60" y="17" textAnchor="middle" fontSize="10" fill="#c8d6ff" fontFamily="var(--font-text), sans-serif">Sign in required</text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

export function AutomationObjects() {
  return (
    <g>
      <Glow cx={960} cy={500} rx={480} ry={260} kind="blue" opacity={0.45} />
      <Laptop />
      <g transform="translate(1250 730) rotate(-10)">
        <rect x="-30" y="-58" width="60" height="116" rx="10" fill="#1b2330" />
        <rect x="-25" y="-50" width="50" height="100" rx="4" fill="#0c1b33" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="-19" y={-42 + i * 22} width="38" height="16" rx="4" fill="#3d6fff" opacity="0.45" />
        ))}
      </g>
    </g>
  );
}
