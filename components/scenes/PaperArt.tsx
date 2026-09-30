/** 1920s–1940s · The Paper System — plaster & wood panelling, tall window, filing cabinet, banker's lamp. */
import { Glow, Person } from "./common";

export function PaperBackground() {
  return (
    <g>
      <rect x="-200" y="-100" width="2000" height="660" fill="#4a3623" />
      {/* wainscot */}
      <rect x="-200" y="380" width="2000" height="180" fill="#3a2716" />
      <g stroke="#000" strokeOpacity="0.25">
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={-160 + i * 140} y="400" width="110" height="140" fill="none" strokeWidth="2" />
        ))}
      </g>
      <rect x="-200" y="376" width="2000" height="8" fill="#6b4a2a" />
      {/* tall window with daylight */}
      <g transform="translate(1030 40)">
        <rect x="-10" y="-10" width="320" height="350" fill="#2a1a0e" />
        <rect width="300" height="330" fill="url(#g-daylight)" />
        <path d="M150 0 L150 330 M0 110 L300 110 M0 220 L300 220 M75 0 L75 330 M225 0 L225 330" stroke="#2a1a0e" strokeWidth="6" />
        <g fill="#6b5236" opacity="0.5">
          <rect x="10" y="250" width="40" height="80" />
          <rect x="56" y="220" width="54" height="110" />
          <rect x="190" y="236" width="70" height="94" />
        </g>
      </g>
      {/* door with frosted glass: a manager checks records */}
      <g transform="translate(560 110)">
        <rect width="170" height="450" fill="#3a2414" />
        <rect x="18" y="20" width="134" height="200" fill="#c9b48e" opacity="0.55" />
        <text x="85" y="60" textAnchor="middle" fill="#2a1a0e" fontSize="15" letterSpacing="0.2em" fontFamily="Georgia, serif" opacity="0.7">ACCOUNTS</text>
        <Person x={96} y={236} s={0.95} hat="fedora" fill="#2a1a0e" opacity={0.55} pose="reach" />
        <circle cx="150" cy="260" r="6" fill="url(#g-brass)" />
      </g>
      {/* wall clock */}
      <g transform="translate(880 150)">
        <circle r="38" fill="#e9dcc0" stroke="#3a2414" strokeWidth="6" />
        <path d="M0 0 L0 -24 M0 0 L16 8" stroke="#1a1008" strokeWidth="3" strokeLinecap="round" data-clock-hand />
      </g>
      {/* filing cabinet */}
      <g transform="translate(1390 230)">
        <rect width="170" height="330" fill="#5c4028" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="12" y={12 + i * 80} width="146" height="70" fill="#6e4d30" />
            <rect x="70" y={40 + i * 80} width="30" height="7" rx="2" fill="url(#g-brass)" />
            <rect x="72" y={24 + i * 80} width="26" height="10" fill="#e8dcc0" />
          </g>
        ))}
      </g>
      {/* clerk filing */}
      <Person x={1350} y={560} s={1.05} hat="none" fill="#1a1008" opacity={0.6} pose="reach" />
    </g>
  );
}

export function PaperObjects() {
  return (
    <g>
      {/* banker's lamp */}
      <g transform="translate(1240 560)">
        <Glow cx={-20} cy={110} rx={330} ry={150} kind="warm" opacity={0.85} />
        <ellipse cx="0" cy="76" rx="40" ry="10" fill="url(#g-brass)" />
        <path d="M0 76 L0 -6" stroke="url(#g-brass)" strokeWidth="6" />
        <path d="M-70 -6 Q0 -44 70 -6 L62 6 L-62 6 Z" fill="#1f5a3a" />
        <path d="M-62 6 L62 6" stroke="#ffe3a0" strokeWidth="3" opacity="0.9" />
      </g>
      {/* stack of folders */}
      <g transform="translate(690 700)">
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${-70 + i * 2} ${-i * 9} L${60 + i * 2} ${-i * 9} L${76 + i * 2} ${26 - i * 9} L${-86 + i * 2} ${26 - i * 9} Z`} fill={["#b89868", "#a5835a", "#c7a978", "#9d7a50"][i]} stroke="#5a3e22" strokeWidth="0.8" />
        ))}
        <rect x="-20" y="-36" width="40" height="8" fill="#e9dcc0" />
      </g>
      {/* invoices on a spike */}
      <g transform="translate(610 800)">
        <ellipse cx="0" cy="6" rx="22" ry="6" fill="#2a1a0e" />
        <path d="M0 6 L0 -60" stroke="#999" strokeWidth="2" />
        {[0, 8, 16].map((d) => (
          <path key={d} d={`M-26 ${-d} L26 ${-d - 4} L28 ${-d + 6} L-24 ${-d + 10} Z`} fill="#efe6d0" stroke="#b3a27f" strokeWidth="0.6" />
        ))}
      </g>
      {/* rubber stamp and pad */}
      <g transform="translate(1210 780)">
        <rect x="-36" y="-8" width="60" height="18" rx="3" fill="#23303f" />
        <rect x="-30" y="-6" width="48" height="12" fill="#6b2233" />
        <rect x="46" y="-6" width="26" height="12" fill="#2a1a0e" />
        <rect x="52" y="-30" width="14" height="26" rx="3" fill="#5a3a1e" />
        <ellipse cx="59" cy="-32" rx="12" ry="7" fill="#3a2414" />
      </g>
      {/* fountain pen */}
      <g transform="translate(1120 736) rotate(-20)">
        <rect x="0" y="-4" width="96" height="8" rx="4" fill="#111" />
        <path d="M0 -4 L-16 0 L0 4 Z" fill="url(#g-brass)" />
        <rect x="60" y="-4" width="4" height="8" fill="url(#g-brass)" />
      </g>
    </g>
  );
}
