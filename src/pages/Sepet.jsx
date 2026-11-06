import { Link } from "react-router-dom";
import { useSepet } from "../context/SepetContext";
import ParfumGorseli from "../components/ParfumGorseli";
import {
  eksikOzelKalemMi,
  fiyatYaz,
  kargoHesapla,
  renkKaristir,
  UCRETSIZ_KARGO_SINIRI,
} from "../yardimci";

function Sepet() {
  const { urunler, adetDegistir, cikar, temizle, toplamAdet, toplamTutar } = useSepet();
  const kargo = kargoHesapla(toplamTutar);
  const eksikVar = urunler.some(eksikOzelKalemMi);

  if (urunler.length === 0) {
    return (
      <div className="sayfa-genis bos-durum">
        <h1>Sepetin boş</h1>
        <p className="soluk">Koleksiyona göz atıp sana uygun kokuyu bulabilirsin.</p>
        <Link to="/parfumler" className="buton">
          Koleksiyonu keşfet
        </Link>
      </div>
    );
  }

  return (
    <div className="sayfa-genis">
      <header className="sayfa-ust">
        <h1>Sepetim</h1>
        <p className="soluk">{toplamAdet} ürün</p>
      </header>

      <div className="sepet-duzeni">
        <ul className="sepet-listesi">
          {urunler.map((u) => (
            <li key={u.id} className="sepet-satiri">
              <Link
                to={u.ozel ? "/kendi-kokun" : `/parfum/${u.id}`}
                className="sepet-gorsel"
                style={{ "--ton": renkKaristir(u.renk ?? "#c9a77c", "#ffffff", 0.82) }}
              >
                <ParfumGorseli parfum={u} />
              </Link>

              <div className="sepet-urun">
                <span className="ust-baslik" lang="en">
                  {u.marka}
                </span>
                {u.ozel ? (
                  <span className="sepet-ad">{u.ad}</span>
                ) : (
                  <Link to={`/parfum/${u.id}`} className="sepet-ad">
                    {u.ad}
                  </Link>
                )}
                {u.ozel && <span className="sepet-tarif">{u.tarif}</span>}
                <span className="soluk">{fiyatYaz(u.fiyat)} / adet</span>
                <button className="link-buton kaldir" onClick={() => cikar(u.id)}>
                  Kaldır
                </button>
              </div>

              <div className="adet-kontrol" aria-label={`${u.ad} adedi`}>
                <button
                  onClick={() => adetDegistir(u.id, u.adet - 1)}
                  disabled={u.adet <= 1}
                  aria-label="Azalt"
                >
                  −
                </button>
                <span>{u.adet}</span>
                <button
                  onClick={() => adetDegistir(u.id, u.adet + 1)}
                  disabled={u.adet >= u.stok}
                  aria-label="Arttır"
                >
                  +
                </button>
              </div>

              <strong className="satir-tutar">{fiyatYaz(u.adet * u.fiyat)}</strong>
            </li>
          ))}
        </ul>

        <aside className="sepet-ozet">
          <h2>Sipariş özeti</h2>
          <div className="ozet-satir">
            <span>Ara toplam</span>
            <span>{fiyatYaz(toplamTutar)}</span>
          </div>
          <div className="ozet-satir">
            <span>Kargo</span>
            <span>{kargo === 0 ? "Ücretsiz" : fiyatYaz(kargo)}</span>
          </div>
          {kargo > 0 && (
            <p className="kargo-ipucu">
              {fiyatYaz(UCRETSIZ_KARGO_SINIRI - toplamTutar)} daha ekle, kargo ücretsiz olsun.
            </p>
          )}
          <div className="ozet-satir toplam">
            <span>Toplam</span>
            <strong>{fiyatYaz(toplamTutar + kargo)}</strong>
          </div>
          {eksikVar && (
            <p className="hata kucuk">
              Sepetindeki bir özel parfüm atölyenin eski sürümünde eklenmiş. Kaldırıp atölyeden yeniden
              ekle.
            </p>
          )}
          <Link
            to="/odeme"
            className={`buton tam buyuk${eksikVar ? " pasif" : ""}`}
            aria-disabled={eksikVar}
            onClick={(e) => eksikVar && e.preventDefault()}
          >
            Siparişi tamamla
          </Link>
          <div className="ozet-alt">
            <Link to="/parfumler">← Alışverişe devam et</Link>
            <button className="link-buton" onClick={temizle}>
              Sepeti boşalt
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Sepet;
