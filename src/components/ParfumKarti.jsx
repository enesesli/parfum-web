import { Link } from "react-router-dom";
import { useSepet } from "../context/SepetContext";
import ParfumGorseli from "./ParfumGorseli";
import { fiyatYaz, indirimOrani, KISA_KONSANTRASYON, renkKaristir } from "../yardimci";

function ParfumKarti({ parfum }) {
  const { ekle, urunler } = useSepet();
  const sepettekiAdet = urunler.find((u) => u.id === parfum.id)?.adet ?? 0;
  const indirim = indirimOrani(parfum);
  const tukendi = parfum.stok === 0;
  const stokDoldu = sepettekiAdet >= parfum.stok;
  const adres = `/parfum/${parfum.id}`;

  return (
    <article className="urun-karti">
      <Link
        to={adres}
        className="urun-gorsel"
        style={{ "--ton": renkKaristir(parfum.renk, "#ffffff", 0.82) }}
        aria-label={`${parfum.marka} ${parfum.ad}`}
      >
        <ParfumGorseli parfum={parfum} />
        <div className="rozetler">
          {parfum.yeni && <span className="rozet-yeni">Yeni</span>}
          {indirim > 0 && <span className="rozet-indirim">-%{indirim}</span>}
        </div>
        {tukendi && <span className="tukendi-perde">Tükendi</span>}
      </Link>

      <div className="urun-bilgi">
        <span className="ust-baslik" lang="en">
          {parfum.marka}
        </span>
        <h3 className="urun-ad">
          <Link to={adres}>{parfum.ad}</Link>
        </h3>
        <span className="urun-alt">
          {KISA_KONSANTRASYON[parfum.konsantrasyon] ?? parfum.konsantrasyon} · {parfum.hacimMl} ml ·{" "}
          {parfum.kokuAilesi}
        </span>
        <div className="urun-fiyat">
          {indirim > 0 && <s>{fiyatYaz(parfum.eskiFiyat)}</s>}
          <strong className={indirim > 0 ? "indirimli" : ""}>{fiyatYaz(parfum.fiyat)}</strong>
        </div>
      </div>

      <button
        className="hizli-ekle"
        disabled={tukendi || stokDoldu}
        onClick={() => ekle(parfum)}
      >
        {tukendi
          ? "Tükendi"
          : stokDoldu
            ? "Stok sınırında"
            : sepettekiAdet > 0
              ? `Sepette (${sepettekiAdet}) · Bir tane daha`
              : "Sepete ekle"}
      </button>
    </article>
  );
}

export default ParfumKarti;
