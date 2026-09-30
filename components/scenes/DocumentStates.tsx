import type { ReactNode } from "react";
/**
 * The document — the visual bridge between eras.
 * manuscript → ledger → printed page → account book  (the typewritten page lives in the typewriter)
 * All states share the same footprint on the desk so they can cross-dissolve in place.
 */

const PAGE = "M852 642 L1068 642 L1102 800 L818 800 Z";

function Script({ y, x1 = 874, x2 = 1052, seed = 0 }: { y: number; x1?: number; x2?: number; seed?: number }) {
  // abstract calligraphic line: flowing strokes with dots, evocative rather than literal text
  const segs: string[] = [];
  let x = x2;
  let i = seed;
  while (x > x1 + 20) {
    const w = 18 + ((i * 7) % 16);
    const h = 4 + ((i * 5) % 7);
    segs.push(`M${x} ${y} q${-w / 2} ${-h} ${-w} 0`);
    x -= w + 6 + ((i * 3) % 6);
    i++;
  }
  return (
    <g>
      <path d={segs.join(" ")} stroke="#3b220e" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.8" />
      <circle cx={x2 - 30 - (seed % 3) * 20} cy={y - 10} r="1.8" fill="#3b220e" opacity="0.8" />
      <circle cx={x1 + 50 + (seed % 4) * 12} cy={y + 7} r="1.6" fill="#3b220e" opacity="0.8" />
    </g>
  );
}

export function Manuscript() {
  return (
    <g data-doc="manuscript">
      <path d={PAGE} fill="#000" opacity="0.35" transform="translate(6 8)" />
      <path d={PAGE} fill="url(#g-paper)" />
      <path d="M866 654 L1056 654" stroke="#8a5a2a" strokeWidth="1" opacity="0.5" />
      <Script y={668} seed={1} />
      <Script y={686} seed={4} x1={900} />
      {/* line 3 is written live by the thread (ink) */}
      <path d="M842 790 L1080 790" stroke="#8a5a2a" strokeWidth="1" opacity="0.4" />
      {/* margin rosette */}
      <circle cx="1050" cy="766" r="9" fill="none" stroke="#8a4a1a" strokeWidth="1.4" opacity="0.6" />
    </g>
  );
}

function Rules({ x1, x2, from, to, step, color }: { x1: number; x2: number; from: number; to: number; step: number; color: string }) {
  const ys: number[] = [];
  for (let y = from; y <= to; y += step) ys.push(y);
  return (
    <g stroke={color} strokeWidth="0.9" opacity="0.5">
      {ys.map((y) => (
        <line key={y} x1={x1 - (y - 650) * 0.2} x2={x2 + (y - 650) * 0.2} y1={y} y2={y} />
      ))}
    </g>
  );
}

function OpenBook({ binding, children }: { binding: string; children?: ReactNode }) {
  return (
    <g>
      <path d="M800 646 L1120 646 L1160 812 L760 812 Z" fill={binding} />
      <path d="M814 650 L958 654 L958 804 L786 800 Z" fill="url(#g-paper-white)" />
      <path d="M962 654 L1106 650 L1134 800 L962 804 Z" fill="url(#g-paper-white)" />
      <path d="M958 654 L962 654 L962 804 L958 804 Z" fill="#000" opacity="0.25" />
      {children}
    </g>
  );
}

export function Ledger() {
  return (
    <g data-doc="ledger">
      <OpenBook binding="#3a1f12">
        <Rules x1={818} x2={954} from={672} to={792} step={14} color="#6b7a99" />
        <Rules x1={966} x2={1104} from={672} to={792} step={14} color="#6b7a99" />
        <line x1="930" y1="662" x2="934" y2="798" stroke="#b33" strokeWidth="1" opacity="0.6" />
        <line x1="1076" y1="662" x2="1082" y2="798" stroke="#b33" strokeWidth="1" opacity="0.6" />
        <g stroke="#243049" strokeWidth="1.4" opacity="0.8" fill="none">
          <path d="M826 684 q6 -5 12 0 t12 0 t12 0 M944 684 l-8 0" />
          <path d="M826 698 q6 -5 12 0 t12 0 M944 698 l-10 0" />
          <path d="M976 684 q6 -5 12 0 t12 0 t12 0 t12 0 M1090 684 l-8 0" />
          <path d="M976 698 q6 -5 12 0 t12 0 M1092 698 l-10 0" />
        </g>
      </OpenBook>
    </g>
  );
}

export function PrintedPage() {
  return (
    <g data-doc="printed">
      <path d={PAGE} fill="#000" opacity="0.35" transform="translate(6 8)" />
      <path d={PAGE} fill="url(#g-paper-white)" />
      <rect x="900" y="656" width="120" height="8" fill="#2a2a2a" opacity="0.75" />
      <g fill="#3a3a3a" opacity="0.5">
        {[676, 688, 700, 712, 724, 736, 748, 760, 772].map((y, i) => (
          <rect key={y} x={868 - (y - 650) * 0.22} y={y} width={196 + (y - 650) * 0.44 - (i === 8 ? 90 : 0)} height="4" />
        ))}
      </g>
    </g>
  );
}

export function AccountBook() {
  return (
    <g data-doc="accountbook">
      <OpenBook binding="#1f2a24">
        <Rules x1={818} x2={954} from={666} to={794} step={10} color="#5c7fb0" />
        <Rules x1={966} x2={1104} from={666} to={794} step={10} color="#5c7fb0" />
        {[866, 906, 1010, 1050, 1084].map((x) => (
          <line key={x} x1={x} y1="660" x2={x + (x < 960 ? -6 : 8)} y2="800" stroke="#c0392b" strokeWidth="0.9" opacity="0.6" />
        ))}
        <g fill="#1f2638" opacity="0.7">
          {[676, 686, 696, 706, 716, 736, 746].map((y) => (
            <g key={y}>
              <rect x="870" y={y - 4} width="30" height="3" />
              <rect x="912" y={y - 4} width="34" height="3" />
              <rect x="1016" y={y - 4} width="28" height="3" />
              <rect x="1056" y={y - 4} width="24" height="3" />
            </g>
          ))}
        </g>
        <text x="828" y="668" fontSize="7" fill="#1f2638" opacity="0.7" fontFamily="Georgia, serif">CASH</text>
        <text x="972" y="668" fontSize="7" fill="#1f2638" opacity="0.7" fontFamily="Georgia, serif">ACCOUNTS</text>
      </OpenBook>
    </g>
  );
}
