import { useId } from "react";
import { renkKaristir } from "../yardimci";

// Her parfüm için rengine ve şişe tipine göre çizilen özgün şişe görseli (SVG).
// Gerçek ürün fotoğrafı yerine kullanılır; Aşama 11'de fotoğraf yükleme gelecek.

const SEKILLER = [
  // 0: Klasik dikdörtgen
  {
    govde: <rect x="48" y="92" width="104" height="150" rx="10" />,
    sivi: <rect x="55" y="112" width="90" height="123" rx="6" />,
    boyun: <rect x="86" y="78" width="28" height="16" rx="2" />,
    kapak: <rect x="70" y="38" width="60" height="42" rx="4" />,
    parilti: <rect x="56" y="100" width="7" height="132" rx="3.5" />,
    etiketY: 178,
  },
  // 1: Yuvarlak flakon
  {
    govde: <circle cx="100" cy="170" r="70" />,
    sivi: <path d="M44 150 A58 58 0 1 0 156 150 Z" />,
    boyun: <rect x="88" y="88" width="24" height="16" rx="2" />,
    kapak: <rect x="77" y="40" width="46" height="50" rx="22" />,
    parilti: <path d="M52 150 A50 50 0 0 1 82 112 L84 118 A44 44 0 0 0 58 152 Z" />,
    etiketY: 178,
  },
  // 2: İnce uzun
  {
    govde: <rect x="70" y="70" width="60" height="172" rx="28" />,
    sivi: <rect x="77" y="98" width="46" height="137" rx="21" />,
    boyun: <rect x="90" y="58" width="20" height="14" rx="2" />,
    kapak: <circle cx="100" cy="38" r="22" />,
    parilti: <rect x="77" y="84" width="6" height="140" rx="3" />,
    etiketY: 172,
  },
  // 3: Fasetli
  {
    govde: <polygon points="60,100 140,100 160,140 150,242 50,242 40,140" />,
    sivi: <polygon points="64,118 136,118 152,146 143,235 57,235 48,146" />,
    boyun: <rect x="88" y="86" width="24" height="16" rx="2" />,
    kapak: <polygon points="100,26 130,54 118,88 82,88 70,54" />,
    parilti: <polygon points="62,110 70,110 56,146 64,232 57,232 48,146" />,
    etiketY: 182,
  },
  // 4: Geniş yassı
  {
    govde: <rect x="34" y="120" width="132" height="122" rx="18" />,
    sivi: <rect x="42" y="138" width="116" height="97" rx="12" />,
    boyun: <rect x="88" y="106" width="24" height="16" rx="2" />,
    kapak: <rect x="62" y="56" width="76" height="52" rx="6" />,
    parilti: <rect x="44" y="128" width="8" height="104" rx="4" />,
    etiketY: 190,
  },
];

function SiseGorseli({ renk = "#c9a77c", tip = 0, harf = "E", className = "", baslik }) {
  const ham = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (ad) => `${ad}-${ham}`;
  const sekil = SEKILLER[tip] ?? SEKILLER[0];
  const koyuKapak = tip === 4;

  return (
    <svg
      className={`sise ${className}`}
      viewBox="0 0 200 260"
      role="img"
      aria-label={baslik ?? "Parfüm şişesi"}
    >
      <defs>
        <linearGradient id={id("sivi")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={renkKaristir(renk, "#ffffff", 0.35)} />
          <stop offset="0.55" stopColor={renk} />
          <stop offset="1" stopColor={renkKaristir(renk, "#000000", 0.3)} />
        </linearGradient>
        <linearGradient id={id("kapak")} x1="0" y1="0" x2="1" y2="0">
          {koyuKapak ? (
            <>
              <stop offset="0" stopColor="#3a332e" />
              <stop offset="0.45" stopColor="#1c1815" />
              <stop offset="0.7" stopColor="#4a423b" />
              <stop offset="1" stopColor="#15120f" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#8c6a3c" />
              <stop offset="0.35" stopColor="#f1dfae" />
              <stop offset="0.6" stopColor="#b8925a" />
              <stop offset="1" stopColor="#6e5230" />
            </>
          )}
        </linearGradient>
        <radialGradient id={id("golge")}>
          <stop offset="0" stopColor="#000" stopOpacity="0.22" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="246" rx="74" ry="9" fill={`url(#${id("golge")})`} />

      <g fill="#ffffff" fillOpacity="0.38" stroke="#000" strokeOpacity="0.12" strokeWidth="1.5">
        {sekil.govde}
      </g>
      <g fill={`url(#${id("sivi")})`}>{sekil.sivi}</g>
      <g fill="#ffffff" fillOpacity="0.4">{sekil.parilti}</g>

      <g fill={`url(#${id("kapak")})`}>{sekil.boyun}</g>
      <g fill={`url(#${id("kapak")})`}>{sekil.kapak}</g>

      <g transform={`translate(100 ${sekil.etiketY})`}>
        <rect x="-22" y="-16" width="44" height="32" rx="2" fill="#fffaf2" fillOpacity="0.88" />
        <text
          x="0"
          y="7"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="20"
          fill="#2a211b"
        >
          {harf}
        </text>
      </g>
    </svg>
  );
}

export default SiseGorseli;
