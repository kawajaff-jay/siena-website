/**
 * 1950s–1960s · The Mechanical Office  and  1970s–1980s · The Computer Revolution
 */
import { Glow, Person } from "./common";

/* ─────────────────────────── 1950s ─────────────────────────── */

export function MechanicalBackground() {
  return (
    <g>
      <rect x="-200" y="-100" width="2000" height="660" fill="#46443f" />
      <rect x="-200" y="470" width="2000" height="90" fill="#3a3834" />
      {/* venetian blinds */}
      <g transform="translate(1080 60)">
        <rect x="-8" y="-8" width="376" height="306" fill="#2b2a27" />
        <rect width="360" height="290" fill="#dcd6c6" opacity="0.6" />
        {Array.from({ length: 19 }, (_, i) => (
          <rect key={i} y={i * 15.5} width="360" height="7" fill="#f2ecdd" opacity="0.8" />
        ))}
      </g>
      {/* org chart: structured departments, larger hierarchies */}
      <g transform="translate(640 70)" stroke="#d9d2c0" strokeOpacity="0.55" fill="none">
        <rect x="-10" y="-10" width="320" height="230" fill="#2e2c29" stroke="#1d1c1a" strokeWidth="6" />
        <rect x="120" y="10" width="60" height="26" fill="#e8e2d2" fillOpacity="0.15" />
        <path d="M150 36 L150 60 M50 60 L250 60 M50 60 L50 80 M150 60 L150 80 M250 60 L250 80" />
        {[20, 120, 220].map((x) => (
          <g key={x}>
            <rect x={x} y="80" width="60" height="24" fill="#e8e2d2" fillOpacity="0.1" />
            <path d={`M${x + 30} 104 L${x + 30} 124 M${x + 5} 124 L${x + 55} 124 M${x + 5} 124 L${x + 5} 140 M${x + 55} 124 L${x + 55} 140`} />
            <rect x={x - 12} y="140" width="34" height="18" />
            <rect x={x + 38} y="140" width="34" height="18" />
          </g>
        ))}
        <text x="150" y="196" textAnchor="middle" fill="#d9d2c0" stroke="none" fontSize="11" letterSpacing="0.25em" fontFamily="var(--font-text), sans-serif" opacity="0.6">ORGANIZATION</text>
      </g>
      {/* row of cabinets */}
      <g transform="translate(1460 250)">
        {[0, 1].map((c) => (
          <g key={c} transform={`translate(${c * 90} 0)`}>
            <rect width="86" height="310" fill="#5d5a54" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x="8" y={10 + i * 75} width="70" height="64" fill="#6c6861" />
            ))}
          </g>
        ))}
      </g>
      {/* typing pool silhouettes */}
      <g opacity="0.45">
        <Person x={500} y={560} s={0.8} fill="#1d1c1a" opacity={1} />
        <Person x={420} y={560} s={0.75} fill="#1d1c1a" opacity={1} pose="reach" />
      </g>
      <g transform="translate(980 150)">
        <circle r="30" fill="#eee8da" stroke="#1d1c1a" strokeWidth="5" />
        <path d="M0 0 L0 -19 M0 0 L13 6" stroke="#1d1c1a" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </g>
  );
}

export function Typewriter() {
  return (
    <g transform="translate(960 700)">
      {/* the typed page rises from the platen */}
      <g data-doc="typed">
        <path d="M-80 -250 L80 -250 L84 -118 L-84 -118 Z" fill="url(#g-paper-white)" />
        <g fill="#222" opacity="0.6">
          {[-232, -220, -208, -196, -184, -172].map((y, i) => (
            <rect key={y} x={-64} y={y} width={i === 5 ? 70 : 128 - (i % 2) * 18} height="3.2" />
          ))}
        </g>
      </g>
      <rect x="-150" y="-128" width="300" height="20" rx="10" fill="#1b1b1b" />
      <rect x="-166" y="-124" width="16" height="12" rx="3" fill="#bbb" />
      <path d="M-130 -108 L130 -108 L176 40 L-176 40 Z" fill="#2d3a33" />
      <path d="M-130 -108 L130 -108 L138 -80 L-138 -80 Z" fill="#3c4b43" />
      <path d="M-90 -80 L90 -80 L96 -60 L-96 -60 Z" fill="#141a17" />
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          {Array.from({ length: 11 - (r === 3 ? 4 : 0) }, (_, k) => {
            const n = 11 - (r === 3 ? 4 : 0);
            const w = 220 + r * 28;
            const x = -w / 2 + (k + 0.5) * (w / n);
            return <circle key={k} cx={x} cy={-40 + r * 20} r={7 + r * 0.6} fill="#e9e4d6" stroke="#111" strokeWidth="2" />;
          })}
        </g>
      ))}
      <rect x="-90" y="36" width="180" height="10" rx="5" fill="#111" />
    </g>
  );
}

export function MechanicalObjects() {
  return (
    <g>
      <Glow cx={960} cy={640} rx={480} ry={160} kind="white" opacity={0.7} />
      <Typewriter />
      {/* rotary telephone */}
      <g transform="translate(1270 740)">
        <path d="M-70 30 Q-74 -30 0 -36 Q74 -30 70 30 Z" fill="#161616" />
        <circle cx="0" cy="0" r="28" fill="#ddd6c6" />
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 1.6 + 0.9;
          return <circle key={i} cx={Math.cos(a) * 19} cy={Math.sin(a) * 19} r="4.4" fill="#161616" />;
        })}
        <path d="M-78 -40 Q-80 -66 -54 -64 L54 -64 Q80 -66 78 -40 L60 -40 Q54 -54 40 -52 L-40 -52 Q-54 -54 -60 -40 Z" fill="#0e0e0e" />
      </g>
      {/* adding machine */}
      <g transform="translate(650 740)">
        <path d="M-70 -50 L70 -50 L90 40 L-90 40 Z" fill="#6b6a65" />
        <rect x="-26" y="-92" width="52" height="46" fill="#f3efe4" />
        <g fill="#222">
          {Array.from({ length: 20 }, (_, i) => (
            <rect key={i} x={-52 + (i % 5) * 22} y={-34 + Math.floor(i / 5) * 16} width="14" height="10" rx="2" />
          ))}
        </g>
        <path d="M90 -10 L118 -34" stroke="#ddd" strokeWidth="6" strokeLinecap="round" />
      </g>
      {/* punch cards */}
      <g transform="translate(1120 800) rotate(6)">
        {[0, 4, 8].map((d) => (
          <g key={d} transform={`translate(${d} ${-d})`}>
            <path d="M-60 -24 L60 -24 L60 24 L-54 24 L-60 18 Z" fill="#e8d9a8" stroke="#a8966a" strokeWidth="0.6" />
          </g>
        ))}
        <g fill="#6b5a36" opacity="0.6">
          {Array.from({ length: 24 }, (_, i) => (
            <rect key={i} x={-42 + (i % 12) * 8} y={-22 + Math.floor(i / 12) * 14 + ((i * 7) % 5)} width="3" height="6" />
          ))}
        </g>
      </g>
    </g>
  );
}

/* ─────────────────────────── 1970s ─────────────────────────── */

function TapeReel({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="30" fill="#0c0e0e" stroke="#7a8480" strokeWidth="2" />
      <g data-reel>
        <path d="M0 -26 L0 26 M-22.5 -13 L22.5 13 M-22.5 13 L22.5 -13" stroke="#7a8480" strokeWidth="3" />
      </g>
      <circle r="6" fill="#7a8480" />
    </g>
  );
}

export function ComputerBackground() {
  return (
    <g>
      <rect x="-200" y="-100" width="2000" height="660" fill="#101414" />
      {/* raised floor / ceiling lines */}
      <g stroke="#2a3230" strokeWidth="1">
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={-200} x2={1800} y1={30 + i * 12} y2={30 + i * 12} opacity={0.4 - i * 0.03} />
        ))}
      </g>
      {/* mainframe hall */}
      <g transform="translate(560 150)">
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i} transform={`translate(${i * 128} 0)`}>
            <rect width="120" height="410" fill={i % 2 ? "#1d2524" : "#242d2b"} />
            <rect x="10" y="14" width="100" height="160" fill="#0a0d0d" />
            <TapeReel x={60} y={56} />
            <TapeReel x={60} y={130} />
            <g>
              {Array.from({ length: 12 }, (_, k) => (
                <rect key={k} x={14 + (k % 6) * 16} y={196 + Math.floor(k / 6) * 14} width="8" height="6" fill={(k + i) % 3 === 0 ? "#46ff97" : (k + i) % 4 === 0 ? "#ffb347" : "#2f3a37"} data-blink={(k + i) % 3 === 0 ? "" : undefined} />
              ))}
            </g>
            <rect x="10" y="240" width="100" height="150" fill="#1a2120" />
            <path d="M16 256 L104 256 M16 272 L104 272 M16 288 L104 288" stroke="#0c0f0f" strokeWidth="3" />
          </g>
        ))}
      </g>
      <Person x={1250} y={560} s={1} fill="#050606" opacity={0.8} pose="reach" />
      <Glow cx={960} cy={300} rx={700} ry={260} kind="green" opacity={0.18} />
    </g>
  );
}

export function CrtTerminal() {
  return (
    <g transform="translate(960 470)">
      <Glow cx={0} cy={20} rx={360} ry={260} kind="green" opacity={0.55} />
      <path d="M-150 -130 L150 -130 L160 110 L-160 110 Z" fill="#c9c2ad" />
      <path d="M-150 -130 L150 -130 L160 110 L-160 110 Z" fill="#000" opacity="0.25" />
      <rect x="-122" y="-104" width="244" height="180" rx="16" fill="#041208" />
      <rect x="-122" y="-104" width="244" height="180" rx="16" fill="url(#g-green)" opacity="0.35" />
      <g fill="#46ff97" opacity="0.85">
        {[-84, -72, -60, -48].map((y, i) => (
          <rect key={y} x="-98" y={y} width={[120, 170, 90, 150][i]} height="5" />
        ))}
        <rect x="-98" y="-24" width="60" height="5" />
        <rect x="-32" y="-28" width="10" height="12" data-cursor />
      </g>
      <g fill="#46ff97" opacity="0.4">
        <rect x="-98" y="-4" width="196" height="1" />
      </g>
      <rect x="-40" y="110" width="80" height="30" fill="#aaa38f" />
    </g>
  );
}

export function ComputerObjects() {
  return (
    <g>
      <CrtTerminal />
      {/* keyboard */}
      <g transform="translate(960 700)">
        <path d="M-190 -34 L190 -34 L214 40 L-214 40 Z" fill="#b9b19b" />
        <g fill="#3b3a35">
          {Array.from({ length: 4 }, (_, r) =>
            Array.from({ length: 14 }, (_, k) => (
              <rect key={`${r}-${k}`} x={-176 - r * 6 + k * (26 + r * 0.9)} y={-26 + r * 16} width="20" height="11" rx="2" />
            )),
          )}
        </g>
      </g>
      {/* tractor-feed printout */}
      <g transform="translate(650 740) rotate(-4)">
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M-90 ${-60 + i * 6} L80 ${-60 + i * 6} L96 ${40 + i * 6} L-106 ${40 + i * 6} Z`} fill={i === 2 ? "#eef3ea" : "#dfe6da"} />
        ))}
        <g fill="#b9dcc0" opacity="0.8">
          {[-40, -16, 8, 32].map((y) => (
            <path key={y} d={`M${-88 - (y + 60) * 0.16} ${y} L${84 + (y + 60) * 0.16} ${y} L${86 + (y + 60) * 0.16} ${y + 12} L${-90 - (y + 60) * 0.16} ${y + 12} Z`} />
          ))}
        </g>
        <g fill="#333" opacity="0.5">
          {[-50, -38, -26, -14, -2, 10, 22].map((y) => (
            <rect key={y} x="-60" y={y} width={90 + (y % 3) * 12} height="2.5" />
          ))}
        </g>
      </g>
      {/* magnetic tape */}
      <g transform="translate(1250 760)">
        <ellipse cx="0" cy="0" rx="52" ry="18" fill="#16191a" />
        <ellipse cx="0" cy="-8" rx="52" ry="18" fill="#2a2f30" />
        <ellipse cx="0" cy="-8" rx="16" ry="6" fill="#0b0d0d" />
      </g>
    </g>
  );
}
