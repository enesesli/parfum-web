import { fiyatYaz } from "../yardimci";

// Ödeme ve sipariş sayfalarında sağda duran ürün ve tutar özeti.
// "kalemler": { ad, marka, aciklama, adet, tutar }
function SiparisOzeti({ kalemler, araToplam, kargo, toplam, baslik = "Sipariş özeti", not }) {
  return (
    <aside className="sepet-ozet siparis-ozeti">
      <h2>{baslik}</h2>
      <ul className="ozet-kalemler">
        {kalemler.map((k, i) => (
          <li key={i}>
            <span>
              <strong>{k.ad}</strong>
              <small>
                {k.marka}
                {k.aciklama ? ` · ${k.aciklama}` : ""}
              </small>
            </span>
            <span className="ozet-kalem-tutar">
              {k.adet > 1 && <small>{k.adet} ×</small>}
              {fiyatYaz(k.tutar)}
            </span>
          </li>
        ))}
      </ul>
      <div className="ozet-satir">
        <span>Ara toplam</span>
        <span>{fiyatYaz(araToplam)}</span>
      </div>
      <div className="ozet-satir">
        <span>Kargo</span>
        <span>{kargo === 0 ? "Ücretsiz" : fiyatYaz(kargo)}</span>
      </div>
      <div className="ozet-satir toplam">
        <span>Toplam</span>
        <strong>{fiyatYaz(toplam)}</strong>
      </div>
      {not && <p className="soluk kucuk">{not}</p>}
    </aside>
  );
}

export default SiparisOzeti;
