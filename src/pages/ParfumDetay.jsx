import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { parfumGetir } from "../api";
import { fiyatYaz } from "../components/ParfumKarti";
import { useSepet } from "../context/SepetContext";

function ParfumDetay() {
  const { id } = useParams();
  const { ekle, urunler } = useSepet();
  const [parfum, setParfum] = useState(null);
  const [hata, setHata] = useState("");

  useEffect(() => {
    setParfum(null);
    setHata("");
    parfumGetir(id)
      .then(setParfum)
      .catch((e) =>
        setHata(
          e.durum === 404 ? "Bu parfüm bulunamadı." : "Parfüm yüklenemedi.",
        ),
      );
  }, [id]);

  if (hata) {
    return (
      <div>
        <p className="hata">{hata}</p>
        <Link to="/">← Tüm parfümler</Link>
      </div>
    );
  }

  if (!parfum) return <p>Yükleniyor...</p>;

  const sepettekiAdet = urunler.find((u) => u.id === parfum.id)?.adet ?? 0;
  const stokDoldu = sepettekiAdet >= parfum.stok;

  return (
    <article className="detay">
      <Link to="/" className="geri-link">
        ← Tüm parfümler
      </Link>

      <span className="kart-marka">{parfum.marka}</span>
      <h1>{parfum.ad}</h1>
      <p className="detay-aciklama">{parfum.aciklama}</p>

      <dl className="detay-bilgiler">
        <dt>Hacim</dt>
        <dd>{parfum.hacimMl} ml</dd>
        <dt>Cinsiyet</dt>
        <dd>{parfum.cinsiyet}</dd>
        <dt>Stok</dt>
        <dd>{parfum.stok > 0 ? `${parfum.stok} adet` : "Tükendi"}</dd>
      </dl>

      <div className="detay-alt">
        <strong className="detay-fiyat">{fiyatYaz(parfum.fiyat)}</strong>
        <button
          disabled={parfum.stok === 0 || stokDoldu}
          onClick={() => ekle(parfum)}
        >
          {parfum.stok === 0
            ? "Tükendi"
            : stokDoldu
              ? "Stok sınırına ulaşıldı"
              : "Sepete ekle"}
        </button>
      </div>

      {sepettekiAdet > 0 && (
        <p className="sepet-bilgi">
          Sepetinde {sepettekiAdet} adet var.{" "}
          <Link to="/sepet">Sepete git →</Link>
        </p>
      )}
    </article>
  );
}

export default ParfumDetay;
