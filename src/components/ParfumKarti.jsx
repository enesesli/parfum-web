import { Link } from "react-router-dom";

export function fiyatYaz(fiyat) {
  return fiyat.toLocaleString("tr-TR") + " ₺";
}

function ParfumKarti({ parfum }) {
  return (
    <Link to={`/parfum/${parfum.id}`} className="parfum-karti">
      <span className="kart-marka">{parfum.marka}</span>
      <h3>{parfum.ad}</h3>
      <span className="kart-bilgi">
        {parfum.hacimMl} ml · {parfum.cinsiyet}
      </span>
      <div className="kart-alt">
        <strong>{fiyatYaz(parfum.fiyat)}</strong>
        {parfum.stok === 0 && <span className="tukendi">Tükendi</span>}
      </div>
    </Link>
  );
}

export default ParfumKarti;
