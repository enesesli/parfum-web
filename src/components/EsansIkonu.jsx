import { renkKaristir } from "../yardimci";

// 30 esansın her biri için küçük, aynı tarzda çizilmiş illüstrasyonlar (SVG).
// Renkler atölyedeki esans renkleriyle aynı; böylece katalog sayfalarında da kullanılabilir.

const RENKLER = {
  Bergamot: "#e9d36b", Limon: "#f2e24a", Greyfurt: "#f29a8a", Mandalina: "#f4a340",
  Armut: "#d8d97a", Ahududu: "#c8455d", Nane: "#7fc39a", "Deniz notası": "#7fb7cf",
  "Pembe biber": "#e07f8a", Kakule: "#b7b56a", Gül: "#d9667e", Yasemin: "#f3ead0",
  Süsen: "#b9a7d6", "Portakal çiçeği": "#f5e3c0", Şakayık: "#efb3c3", Lavanta: "#9b8ac4",
  Adaçayı: "#8fa58a", "Yeşil çay": "#a3bb83", Tarçın: "#a5622f", Safran: "#d08a2e",
  Vanilya: "#e8cf9e", Tonka: "#b98a5a", Kakao: "#5c3a28", Sedir: "#a07a54",
  "Sandal ağacı": "#d8b07a", Vetiver: "#7d8a64", Ud: "#4a2c2a", Amber: "#c8894a",
  Tütsü: "#8a8170", "Beyaz misk": "#f1ece6",
};

// Katalogdaki bazı nota adlarını esans çizimlerine bağlar
const ESANLAMLILAR = { Misk: "Beyaz misk", "Taif gülü": "Gül", "Isparta gülü": "Gül" };

const YAPRAK = "#7aa35f";

// Her çizim: r = ana renk, k = kontur (koyu), a = açık ton
const CIZIMLER = {
  Bergamot: ({ r, a }) => (
    <>
      <circle cx="24" cy="28" r="13" fill={r} />
      <path d="M16 24a9 9 0 0 1 6-6" stroke={a} strokeWidth="2.2" />
      <path d="M24 15c1-5 6-8 11-7-1 5-5 8-11 7z" fill={YAPRAK} />
      <path d="M24 15l-1-4" />
    </>
  ),
  Limon: ({ r, a }) => (
    <>
      <path d="M9 26c0-8 7-13 15-13s15 5 15 13-7 11-15 11S9 34 9 26z" fill={r} />
      <path d="M9 26l-4-1M39 26l4-1" />
      <path d="M15 23c2-3 5-5 9-5" stroke={a} strokeWidth="2.2" />
    </>
  ),
  Greyfurt: ({ r, a }) => (
    <>
      <path d="M5 31a19 19 0 0 1 38 0z" fill={a} />
      <path d="M9 31a15 15 0 0 1 30 0z" fill={r} />
      <path d="M24 31V16M24 31l-11-8M24 31l11-8M24 31l-7-13M24 31l7-13" />
    </>
  ),
  Mandalina: ({ r, a }) => (
    <>
      <circle cx="24" cy="28" r="12" fill={r} />
      <circle cx="24" cy="17" r="1.6" />
      <path d="M17 25a7 7 0 0 1 5-5" stroke={a} strokeWidth="2.2" />
      <path d="M24 16c-2-4-7-5-10-3 2 3 6 4 10 3z" fill={YAPRAK} />
    </>
  ),
  Armut: ({ r, a }) => (
    <>
      <path d="M24 11c-3 0-4 4-4 7 0 3-7 6-7 14 0 6 5 9 11 9s11-3 11-9c0-8-7-11-7-14 0-3-1-7-4-7z" fill={r} />
      <path d="M24 11l1-5" />
      <path d="M25 9c3-3 7-3 9-1-3 2-6 2-9 1z" fill={YAPRAK} />
      <path d="M17 30c0-3 1-5 3-7" stroke={a} strokeWidth="2.2" />
    </>
  ),
  Ahududu: ({ r }) => (
    <>
      {[[19, 20], [29, 20], [15, 27], [24, 27], [33, 27], [19, 34], [29, 34], [24, 40]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4.6" fill={r} />
      ))}
      <path d="M18 14c2 2 4 3 6 3s4-1 6-3M24 17v-8" stroke="#4f7a3d" />
    </>
  ),
  Nane: ({ r }) => (
    <>
      <path d="M23 41C11 36 9 22 17 11c6 8 8 19 6 30z" fill={r} />
      <path d="M26 39c11-6 13-18 7-27-6 7-8 17-7 27z" fill={r} />
      <path d="M23 41c-2-9-4-19-6-28M26 39c1-9 3-18 7-26M24 44v-4" />
    </>
  ),
  "Deniz notası": ({ r }) => (
    <>
      <circle cx="24" cy="24" r="17" fill={renkKaristir(r, "#ffffff", 0.6)} stroke="none" />
      {[17, 25, 33].map((y) => (
        <path key={y} d={`M8 ${y}c4-4 8-4 12 0s8 4 12 0 6-3 8-1`} stroke={r} strokeWidth="3" />
      ))}
    </>
  ),
  "Pembe biber": ({ r, a }) => (
    <>
      {[[18, 18], [29, 16], [23, 26], [33, 27], [15, 32], [26, 36]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="5" fill={r} />
          <circle cx={x - 1.5} cy={y - 1.5} r="1.2" fill={a} stroke="none" />
        </g>
      ))}
    </>
  ),
  Kakule: ({ r }) => (
    <>
      <ellipse cx="24" cy="25" rx="8" ry="15" transform="rotate(30 24 25)" fill={r} />
      <path d="M17 37c4-6 8-14 14-24M20 39c3-5 7-12 13-21" />
      <path d="M32 12l3-4" />
    </>
  ),
  Gül: ({ r, a }) => (
    <>
      <path d="M24 30v14" stroke="#4f7a3d" strokeWidth="2" />
      <path d="M24 38c-4-1-8 0-10 3 4 2 8 1 10-3zM24 36c3-2 7-2 9 0-3 3-7 3-9 0z" fill={YAPRAK} />
      <path d="M11 15c4 1 6 4 7 6 1-5 4-9 6-11 2 2 5 6 6 11 1-2 3-5 7-6 1 9-3 17-13 17S10 24 11 15z" fill={r} />
      <path d="M18 21c1 4 3 7 6 8 3-1 5-4 6-8M24 10c-2 4-2 9 0 13 2-4 2-9 0-13" />
      <path d="M14 18c0 3 1 6 3 8" stroke={a} strokeWidth="1.8" />
    </>
  ),
  Yasemin: ({ r }) => (
    <>
      {[0, 72, 144, 216, 288].map((aci) => (
        <ellipse key={aci} cx="24" cy="15" rx="5" ry="9" transform={`rotate(${aci} 24 24)`} fill={r} />
      ))}
      <circle cx="24" cy="24" r="3.5" fill="#e8c76a" />
    </>
  ),
  Süsen: ({ r, a }) => (
    <>
      <path d="M24 44V30" stroke={YAPRAK} strokeWidth="2.2" />
      <path d="M24 7c6 6 5 15 0 19-5-4-6-13 0-19z" fill={r} />
      <path d="M24 26c-5-3-14-1-13 7 6 3 12-1 13-7zM24 26c5-3 14-1 13 7-6 3-12-1-13-7z" fill={r} />
      <path d="M24 26c-2 1-3 3-3 5h6c0-2-1-4-3-5z" fill="#e8c76a" />
      <path d="M22 12c1 3 1 7 2 9" stroke={a} />
    </>
  ),
  "Portakal çiçeği": ({ r }) => (
    <>
      {[0, 72, 144, 216, 288].map((aci) => (
        <circle key={aci} cx="24" cy="14" r="6.5" transform={`rotate(${aci} 24 24)`} fill={r} />
      ))}
      <circle cx="24" cy="24" r="4" fill="#f2c94c" />
      {[0, 60, 120, 180, 240, 300].map((aci) => (
        <circle key={aci} cx="24" cy="17.5" r="0.9" transform={`rotate(${aci} 24 24)`} fill="#c08a2b" stroke="none" />
      ))}
    </>
  ),
  Şakayık: ({ r, a }) => (
    <>
      <circle cx="24" cy="25" r="15" fill={r} />
      <path d="M12 22c3-6 9-9 12-9s9 3 12 9" />
      <circle cx="24" cy="26" r="9" fill={a} />
      <path d="M18 26c2-4 4-5 6-5s4 1 6 5M20 30c1-2 3-3 4-3s3 1 4 3" />
    </>
  ),
  Lavanta: ({ r }) => (
    <>
      <path d="M24 44V10" stroke={YAPRAK} strokeWidth="2" />
      {[12, 17, 22, 27, 32].map((y, i) => (
        <g key={y}>
          <ellipse cx={i % 2 ? 20.5 : 27.5} cy={y} rx="3" ry="4" fill={r} />
          <ellipse cx={i % 2 ? 27.5 : 20.5} cy={y + 2.5} rx="3" ry="4" fill={r} />
        </g>
      ))}
      <ellipse cx="24" cy="8" rx="2.6" ry="3.4" fill={r} />
    </>
  ),
  Adaçayı: ({ r, a }) => (
    <>
      <ellipse cx="18" cy="23" rx="7.5" ry="14" transform="rotate(-22 18 23)" fill={r} />
      <ellipse cx="30" cy="23" rx="7.5" ry="14" transform="rotate(22 30 23)" fill={r} />
      <path d="M23 37L13 10M25 37l10-27M24 44v-7" />
      <path d="M15 20l3 1M17 26l3 1M33 20l-3 1M31 26l-3 1" stroke={a} />
    </>
  ),
  "Yeşil çay": ({ r }) => (
    <>
      <path d="M9 39C9 21 23 9 40 9c0 17-12 30-31 30z" fill={r} />
      <path d="M9 39L33 15M17 31l-1-7M22 26l-1-7M27 21l-1-6M17 31l7 1M22 26l7 1M27 21l6 0" />
    </>
  ),
  Tarçın: ({ r, a }) => (
    <>
      {[14, 22, 30].map((y) => (
        <g key={y} transform={`rotate(-14 24 ${y + 3})`}>
          <rect x="9" y={y} width="30" height="6.5" rx="3.2" fill={r} />
          <path d={`M12 ${y + 3.2}h24`} stroke={a} strokeWidth="1" />
          <path d={`M9.5 ${y + 3.2}a2.6 2.6 0 1 0 2.6-2.6`} />
        </g>
      ))}
    </>
  ),
  Safran: ({ r }) => (
    <>
      {["M24 41C22 30 16 22 10 12", "M24 41C24 29 24 20 24 8", "M24 41C26 30 32 22 38 12"].map((d) => (
        <g key={d}>
          <path d={d} strokeWidth="4.5" />
          <path d={d} stroke={r} strokeWidth="2.8" />
        </g>
      ))}
      <circle cx="10" cy="11" r="3" fill={r} />
      <circle cx="24" cy="7" r="3" fill={r} />
      <circle cx="38" cy="11" r="3" fill={r} />
    </>
  ),
  Vanilya: ({ r }) => (
    <>
      {["M12 41C16 28 24 16 36 8", "M19 43C22 31 29 20 40 13"].map((d) => (
        <g key={d}>
          <path d={d} stroke="#3b2a1e" strokeWidth="5.5" />
          <path d={d} stroke="#6b4a32" strokeWidth="3" />
        </g>
      ))}
      {[0, 72, 144, 216, 288].map((aci) => (
        <ellipse key={aci} cx="14" cy="10" rx="2.6" ry="4.6" transform={`rotate(${aci} 14 14)`} fill={r} />
      ))}
      <circle cx="14" cy="14" r="1.8" fill="#e8c76a" />
    </>
  ),
  Tonka: ({ r, a }) => (
    <>
      <ellipse cx="20" cy="25" rx="6" ry="14" transform="rotate(18 20 25)" fill={r} />
      <ellipse cx="32" cy="27" rx="5" ry="11" transform="rotate(-12 32 27)" fill={r} />
      <path d="M17 17c2 1 3 1 5 0M15 24c2 1 4 1 6 0M14 31c2 1 4 1 6 0M30 21c1 1 3 1 4 0M29 28c1 1 3 1 4 0M29 34c1 1 3 1 4 0" />
      <path d="M17 14c-1 3-2 6-2 9" stroke={a} strokeWidth="1.6" />
    </>
  ),
  Kakao: ({ r, a }) => (
    <>
      <path d="M24 6c10 6 12 24 0 36C12 30 14 12 24 6z" fill={r} />
      <path d="M24 6c-3 10-3 26 0 36M24 6c3 10 3 26 0 36M24 6c-7 8-8 22 0 36M24 6c7 8 8 22 0 36" />
      <path d="M19 14c-2 4-2 8-2 11" stroke={a} strokeWidth="1.8" />
    </>
  ),
  Sedir: ({ r }) => (
    <>
      <path d="M22 44v-8h4v8z" fill={r} />
      <path d="M24 5l8 12H16z" fill="#5f7d55" />
      <path d="M24 12l11 13H13z" fill="#5f7d55" />
      <path d="M24 20l14 16H10z" fill="#5f7d55" />
    </>
  ),
  "Sandal ağacı": ({ r, a }) => (
    <>
      <circle cx="24" cy="24" r="16" fill={renkKaristir(r, "#3a2a1c", 0.35)} />
      <circle cx="24" cy="24" r="13" fill={r} />
      <circle cx="24" cy="24" r="9.5" stroke={renkKaristir(r, "#3a2a1c", 0.4)} />
      <circle cx="24" cy="24" r="6" stroke={renkKaristir(r, "#3a2a1c", 0.4)} />
      <circle cx="24" cy="24" r="2.5" fill={a} />
      <path d="M24 11v6" />
    </>
  ),
  Vetiver: ({ r }) => (
    <>
      <path d="M14 27c0-8 2-15 6-20M20 27c0-7 1-13 4-19M26 27c0-6 2-12 6-17M32 27c0-5 2-9 5-12" stroke={r} strokeWidth="2.6" />
      <path d="M10 27h28" stroke="#8a6a4a" strokeWidth="2.4" />
      <path d="M16 28c-1 5-4 9-6 12M21 28c0 5-2 10-3 14M26 28c1 5 1 10 0 14M31 28c2 5 4 9 7 12" stroke="#8a6a4a" />
    </>
  ),
  Ud: ({ r, a }) => (
    <>
      <path d="M7 30l9-12 10 3-4 15-12 1z" fill={r} />
      <path d="M24 17l13-6 5 13-9 9-8-4z" fill={renkKaristir(r, "#000000", 0.2)} />
      <path d="M22 38l9-4 6 6-10 4z" fill={r} />
      <path d="M11 29l8-7M28 16l8-2M27 39l6-2" stroke={a} strokeWidth="1.4" />
    </>
  ),
  Amber: ({ r, a }) => (
    <>
      <path d="M24 6c6 10 13 16 13 25a13 13 0 0 1-26 0c0-9 7-15 13-25z" fill={r} />
      <path d="M24 6v38M11 31h26M17 20l7 11 7-11" stroke={renkKaristir(r, "#3a2410", 0.35)} strokeWidth="1" />
      <path d="M17 29c0-4 2-7 4-10" stroke={a} strokeWidth="2.2" />
    </>
  ),
  Tütsü: ({ r }) => (
    <>
      <path d="M14 42h20" strokeWidth="2.4" />
      <path d="M24 42V22" stroke={r} strokeWidth="3" />
      <circle cx="24" cy="21" r="1.8" fill="#e0703a" stroke="none" />
      <path d="M24 18c-4-3 4-5 0-8s3-5 0-7" stroke={renkKaristir(r, "#ffffff", 0.2)} strokeWidth="1.6" />
      <path d="M27 16c3-2-1-4 2-6" stroke={renkKaristir(r, "#ffffff", 0.35)} strokeWidth="1.2" />
    </>
  ),
  "Beyaz misk": ({ r }) => (
    <>
      <path d="M13 34a7 7 0 0 1 1-14 9 9 0 0 1 17-3 7 7 0 0 1 4 13 5 5 0 0 1-3 4z" fill={r} />
      <path d="M36 8v6M33 11h6M10 9v4M8 11h4M40 30v4M38 32h4" />
    </>
  ),
};

export function esansIkonuVarMi(ad) {
  return Boolean(CIZIMLER[ESANLAMLILAR[ad] ?? ad]);
}

function EsansIkonu({ ad, renk, boyut = 40, className = "" }) {
  const gercekAd = ESANLAMLILAR[ad] ?? ad;
  const cizim = CIZIMLER[gercekAd];
  if (!cizim) return null;

  const r = renk ?? RENKLER[gercekAd] ?? "#c9a77c";
  const k = renkKaristir(r, "#2a1f18", 0.6);
  const a = renkKaristir(r, "#ffffff", 0.55);

  return (
    <svg
      className={`esans-ikonu ${className}`}
      viewBox="0 0 48 48"
      width={boyut}
      height={boyut}
      aria-hidden="true"
      fill="none"
      stroke={k}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {cizim({ r, k, a })}
    </svg>
  );
}

export default EsansIkonu;
