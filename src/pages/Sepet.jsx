import { Link } from "react-router-dom";
import { useSepet } from "../context/SepetContext";
import { fiyatYaz } from "../components/ParfumKarti";

function Sepet() {
  const { urunler, adetDegistir, cikar, temizle, toplamTutar } = useSepet();

  if (urunler.length === 0) {
    return (
      <div className="sepet">
        <h1>Sepetim</h1>
        <p>Sepetin boş.</p>
        <Link to="/" className="geri-link">
          ← Alışverişe devam et
        </Link>
      </div>
    );
  }

  return (
    <div className="sepet">
      <h1>Sepetim</h1>

      <ul className="sepet-listesi">
        {urunler.map((u) => (
          <li key={u.id} className="sepet-satiri">
            <div className="sepet-urun">
              <span className="kart-marka">{u.marka}</span>
              <Link to={`/parfum/${u.id}`}>
                <h3>{u.ad}</h3>
              </Link>
              <span className="kart-bilgi">{fiyatYaz(u.fiyat)} / adet</span>
            </div>

            <div className="adet-kontrol">
              <button
                onClick={() => adetDegistir(u.id, u.adet - 1)}
                disabled={u.adet <= 1}
              >
                −
              </button>
              <span>{u.adet}</span>
              <button
                onClick={() => adetDegistir(u.id, u.adet + 1)}
                disabled={u.adet >= u.stok}
              >
                +
              </button>
            </div>

            <strong className="satir-tutar">
              {fiyatYaz(u.adet * u.fiyat)}
            </strong>

            <button className="ikincil-buton" onClick={() => cikar(u.id)}>
              Kaldır
            </button>
          </li>
        ))}
      </ul>

      <div className="sepet-ozet">
        <button className="ikincil-buton" onClick={temizle}>
          Sepeti boşalt
        </button>
        <div className="toplam">
          <span>Toplam</span>
          <strong className="detay-fiyat">{fiyatYaz(toplamTutar)}</strong>
        </div>
      </div>

      <Link to="/" className="geri-link">
        ← Alışverişe devam et
      </Link>
    </div>
  );
}

export default Sepet;
