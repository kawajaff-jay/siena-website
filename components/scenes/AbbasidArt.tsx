/**
 * Prologue — Abbasid Baghdad, c. 750–1258 CE.
 * Layers: stone hall + arches (bg) · market & caravan seen through the arches · scribe's desk objects.
 * Historically inspired: pointed arches, brick/stone courses, brass lanterns, balance scales,
 * gold dinars & silver dirhams, reed pen (qalam), inkwell, paper manuscripts, sealed contracts.
 */
import { ARCH_MAIN, ARCH_SIDE, Glow, Person } from "./common";

function Camel({ x, y, s = 1, rider = false }: { x: number; y: number; s?: number; rider?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-34 -30 Q-30 -46 -16 -44 Q-8 -58 4 -44 Q14 -40 18 -34 L26 -50 Q30 -56 36 -52 L38 -44 L32 -40 L26 -26 Q22 -18 14 -18 L12 0 L9 0 L8 -16 L-18 -16 L-20 0 L-23 0 L-24 -18 Q-34 -20 -34 -30 Z" />
      {rider && <path d="M-8 -48 L-2 -64 Q0 -70 4 -64 L6 -48 Z" />}
      {rider && <circle cx="1" cy="-70" r="4" />}
    </g>
  );
}

export function AbbasidBackground() {
  return (
    <g>
      {/* stone hall wall */}
      <rect x="-200" y="-100" width="2000" height="660" fill="#2a190c" />
      <g stroke="#000" strokeOpacity="0.28" strokeWidth="1.5">
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1="-200" x2="1800" y1={40 + i * 48} y2={40 + i * 48} />
        ))}
      </g>
      <g stroke="#000" strokeOpacity="0.18" strokeWidth="1.2">
        {Array.from({ length: 11 }, (_, r) =>
          Array.from({ length: 14 }, (_, c) => (
            <line key={`${r}-${c}`} x1={c * 130 + (r % 2) * 65} x2={c * 130 + (r % 2) * 65} y1={40 + r * 48} y2={88 + r * 48} />
          )),
        )}
      </g>
      {/* view through the arches: dusk over Baghdad */}
      <g clipPath="url(#clip-arches)">
        <rect x="400" y="80" width="800" height="500" fill="url(#g-dusk)" />
        <g fill="#fff">
          <circle cx="880" cy="170" r="1.4" opacity="0.8" />
          <circle cx="1040" cy="150" r="1.1" opacity="0.7" />
          <circle cx="990" cy="210" r="0.9" opacity="0.6" />
          <circle cx="500" cy="300" r="1" opacity="0.6" />
        </g>
        {/* crescent moon */}
        <path d="M1066 196 a22 22 0 1 0 14 36 a17 17 0 1 1 -14 -36 Z" fill="#f6e3b5" opacity="0.9" />
        {/* distant city: walls, domes, minaret — restrained, not fantasy */}
        <g fill="#1a1120" data-parallax="0.3">
          <path d="M400 440 L400 418 L520 418 L520 404 L560 404 L560 418 L700 418 L700 410 L740 410 Q760 380 780 410 L840 410 L840 396 Q872 352 904 396 L904 410 L960 410 L960 340 L968 334 L976 340 L976 410 L1040 410 Q1068 376 1096 410 L1200 410 L1200 440 Z" />
        </g>
        {/* caravan on the horizon */}
        <g fill="#140c14" data-caravan>
          <Camel x={820} y={452} s={0.7} rider />
          <Camel x={870} y={452} s={0.7} />
          <Camel x={918} y={452} s={0.7} rider />
          <Camel x={966} y={452} s={0.7} />
          <Person x={1000} y={452} s={0.2} hat="turban" fill="#140c14" opacity={1} />
        </g>
        {/* the market: awnings, goods, merchants weighing and negotiating */}
        <g data-parallax="0.6">
          <rect x="400" y="470" width="800" height="120" fill="#1b0f08" />
          <path d="M780 470 L860 470 L850 486 L790 486 Z" fill="#6b2f1a" />
          <path d="M1000 470 L1110 470 L1098 488 L1012 488 Z" fill="#2e4a5a" />
          <path d="M450 470 L560 470 L548 486 L462 486 Z" fill="#6b4a1a" />
          <g fill="#0e0805">
            <Person x={806} y={560} s={0.52} hat="turban" opacity={1} fill="#0e0805" pose="reach" />
            <Person x={880} y={560} s={0.5} hat="turban" opacity={1} fill="#0e0805" />
            <Person x={1060} y={560} s={0.55} hat="turban" opacity={1} fill="#0e0805" pose="reach" />
            <Person x={1120} y={560} s={0.5} hat="none" opacity={1} fill="#0e0805" />
            <Person x={510} y={560} s={0.5} hat="turban" opacity={1} fill="#0e0805" />
            {/* merchant's balance in the market */}
            <path d="M836 488 L836 520 M818 492 L854 492" stroke="#0e0805" strokeWidth="2" />
            <path d="M812 492 L818 506 L824 492 Z M848 492 L854 506 L860 492 Z" />
            {/* sacks and amphorae */}
            <path d="M940 560 Q930 520 950 516 Q970 520 962 560 Z M972 560 Q966 530 982 528 Q998 530 992 560 Z" />
            <path d="M600 560 Q588 530 604 520 L604 512 L612 512 L612 520 Q628 530 616 560 Z" />
          </g>
        </g>
      </g>
      {/* arch frames */}
      <path d={ARCH_MAIN} fill="none" stroke="#8a6238" strokeOpacity="0.55" strokeWidth="10" />
      <path d={ARCH_MAIN} fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="2" transform="translate(0 6)" />
      <path d={ARCH_SIDE} fill="none" stroke="#8a6238" strokeOpacity="0.45" strokeWidth="8" />
      {/* niche with scrolls and ledgers (right) */}
      <g transform="translate(1260 170)">
        <path d="M0 390 L0 110 Q0 40 120 10 Q240 40 240 110 L240 390 Z" fill="#170d06" />
        <rect x="14" y="170" width="212" height="8" fill="#5a3a1e" />
        <rect x="14" y="290" width="212" height="8" fill="#5a3a1e" />
        {[20, 46, 72, 98].map((x, i) => (
          <g key={x}>
            <rect x={x} y={146 - (i % 2) * 6} width="22" height={24 + (i % 2) * 6} rx="2" fill="#d8c29a" opacity="0.85" />
            <ellipse cx={x + 11} cy={146 - (i % 2) * 6} rx="11" ry="3" fill="#b89b6c" />
          </g>
        ))}
        <rect x="140" y="130" width="18" height="40" fill="#6a2f1b" />
        <rect x="160" y="136" width="16" height="34" fill="#3d4a2a" />
        <rect x="178" y="126" width="20" height="44" fill="#5a2a1a" />
        {[26, 60, 96, 130, 166].map((x) => (
          <ellipse key={x} cx={x + 14} cy="278" rx="14" ry="10" fill="#d4bf95" opacity="0.8" />
        ))}
        <path d="M40 390 Q20 330 50 318 L50 306 L66 306 L66 318 Q96 330 76 390 Z" fill="#7a4a24" opacity="0.8" />
      </g>
      {/* hanging brass lanterns */}
      {[
        { x: 690, l: 150 },
        { x: 1210, l: 120 },
      ].map(({ x, l }) => (
        <g key={x}>
          <line x1={x} y1="-10" x2={x} y2={l} stroke="#3a2412" strokeWidth="2" />
          <Glow cx={x} cy={l + 30} rx={150} ry={150} kind="warm" opacity={0.75} />
          <path d={`M${x - 16} ${l + 10} L${x + 16} ${l + 10} L${x + 22} ${l + 40} L${x} ${l + 62} L${x - 22} ${l + 40} Z`} fill="url(#g-brass)" />
          <path d={`M${x - 10} ${l + 18} L${x + 10} ${l + 18} L${x + 13} ${l + 38} L${x} ${l + 50} L${x - 13} ${l + 38} Z`} fill="#ffcf7a" opacity="0.85" />
        </g>
      ))}
    </g>
  );
}

/** Scribe's desk objects (manuscript is in DocumentStates) */
export function AbbasidObjects() {
  return (
    <g>
      {/* candle — the desk's first light source */}
      <g transform="translate(1280 598)">
        <Glow cx={0} cy={-40} rx={260} ry={200} kind="warm" opacity={0.85} />
        <ellipse cx="0" cy="44" rx="34" ry="9" fill="url(#g-brass)" />
        <rect x="-11" y="-30" width="22" height="72" rx="3" fill="#efe2c4" />
        <path d="M0 -30 L0 -38" stroke="#2a1a0e" strokeWidth="2" />
        <path d="M0 -70 Q9 -52 0 -38 Q-9 -52 0 -70 Z" fill="#ffd27a" data-flame />
        <path d="M0 -60 Q4 -50 0 -42 Q-4 -50 0 -60 Z" fill="#fff5d6" />
      </g>
      {/* brass balance scales */}
      <g transform="translate(690 610)" stroke="url(#g-brass)" fill="none">
        <path d="M0 -140 L0 30" strokeWidth="5" />
        <path d="M-26 34 L26 34" strokeWidth="7" strokeLinecap="round" />
        <path d="M-80 -128 L80 -128" strokeWidth="4" strokeLinecap="round" />
        <circle cx="0" cy="-144" r="6" fill="url(#g-brass)" />
        <path d="M-80 -128 L-104 -70 M-80 -128 L-56 -70 M80 -128 L56 -76 M80 -128 L104 -76" strokeWidth="1.2" />
        <path d="M-110 -70 Q-80 -52 -50 -70 Z" fill="url(#g-brass)" strokeWidth="1" />
        <path d="M50 -76 Q80 -58 110 -76 Z" fill="url(#g-brass)" strokeWidth="1" />
        <g fill="#e8c35c" stroke="none">
          <ellipse cx="-86" cy="-73" rx="9" ry="3" />
          <ellipse cx="-74" cy="-76" rx="9" ry="3" />
        </g>
      </g>
      {/* coins: gold dinars and silver dirhams */}
      <g transform="translate(700 760)">
        {[0, 6, 12, 18, 24].map((d) => (
          <ellipse key={d} cx="0" cy={-d} rx="24" ry="8" fill="url(#g-brass)" stroke="#6e4c1c" strokeWidth="1" />
        ))}
        {[0, 6, 12].map((d) => (
          <ellipse key={d} cx="62" cy={12 - d} rx="22" ry="7.5" fill="#c9ccd1" stroke="#7d8189" strokeWidth="1" />
        ))}
        <ellipse cx="30" cy="34" rx="20" ry="6.5" fill="url(#g-brass)" stroke="#6e4c1c" />
        <ellipse cx="96" cy="36" rx="19" ry="6" fill="#c9ccd1" stroke="#7d8189" />
      </g>
      {/* inkwell */}
      <g transform="translate(1168 690)">
        <ellipse cx="0" cy="22" rx="30" ry="8" fill="#000" opacity="0.35" />
        <path d="M-24 18 Q-28 -8 -12 -14 L12 -14 Q28 -8 24 18 Z" fill="url(#g-brass)" />
        <ellipse cx="0" cy="-14" rx="12" ry="4" fill="#120904" />
      </g>
      {/* sealed contract */}
      <g transform="translate(1180 790) rotate(-8)">
        <rect x="-80" y="-14" width="160" height="28" rx="14" fill="url(#g-paper)" />
        <ellipse cx="-80" cy="0" rx="8" ry="14" fill="#cdb487" />
        <path d="M-10 -14 L-10 14 M6 -14 L6 14" stroke="#7a2a1c" strokeWidth="3" />
        <circle cx="-2" cy="14" r="10" fill="#9a2b1f" />
      </g>
    </g>
  );
}

/** The reed pen that writes the first line. Positioned by choreography along the ink thread. */
export function Qalam() {
  return (
    <g data-qalam>
      <g transform="rotate(-38)">
        <path d="M0 0 L6 -8 L150 -14 L152 -6 L8 2 Z" fill="#c9a26a" />
        <path d="M0 0 L6 -8 L14 -6 L8 2 Z" fill="#2b170a" />
        <path d="M60 -10 L62 -3" stroke="#8a6238" strokeWidth="1.2" />
      </g>
    </g>
  );
}
