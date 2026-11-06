import { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSepet } from "../context/SepetContext";
import { useAuth } from "../context/AuthContext";
import { KOKU_AILELERI } from "../yardimci";

const YIL = new Date().getFullYear();

function CantaIkonu() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 8h14l-1 12H6L5 8Z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}

// Sayfa değişince en üste kaydır
function SayfaBasinaDon() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function Ust() {
  const { toplamAdet } = useSepet();
  const { girisYapildi, cikis } = useAuth();

  return (
    <>
      <SayfaBasinaDon />
      <div className="duyuru">
        Kişisel öğrenme projesidir · Satış yapılmaz, fiyatlar temsilidir.
      </div>
      <header className="ust">
        <nav className="ust-menu" aria-label="Ana menü">
          <NavLink to="/parfumler" end>
            Koleksiyon
          </NavLink>
          <Link to="/parfumler?yeni=true">Yeni gelenler</Link>
          <Link to="/parfumler?indirimli=true">İndirim</Link>
          <NavLink to="/kendi-kokun" className="menu-vurgu">
            Kendi kokunu yarat
          </NavLink>
        </nav>

        <Link to="/" className="logo" aria-label="Esans ana sayfa">
          ESANS
        </Link>

        <div className="ust-sag">
          <NavLink to="/admin" className="ust-yonetim">
            Yönetim
          </NavLink>
          {girisYapildi && (
            <button className="link-buton ust-yonetim" onClick={() => cikis()}>
              Çıkış
            </button>
          )}
          <Link to="/sepet" className="sepet-link" aria-label={`Sepet, ${toplamAdet} ürün`}>
            <CantaIkonu />
            {toplamAdet > 0 && <span className="sepet-sayi">{toplamAdet}</span>}
          </Link>
        </div>
      </header>
    </>
  );
}

export function Alt() {
  return (
    <footer className="alt">
      <div className="alt-ic">
        <div>
          <div className="logo logo-acik">ESANS</div>
          <p>
            Dünyanın sevilen parfüm evlerinden seçilmiş kokular. Bu site React ve ASP.NET Core ile
            geliştirilmiş kişisel bir öğrenme projesidir.
          </p>
        </div>
        <div>
          <h4>Keşfet</h4>
          <Link to="/parfumler">Tüm koleksiyon</Link>
          <Link to="/parfumler?yeni=true">Yeni gelenler</Link>
          <Link to="/parfumler?indirimli=true">İndirimdekiler</Link>
          <Link to="/kendi-kokun">Koku atölyesi</Link>
          <Link to="/sepet">Sepetim</Link>
          <Link to="/siparis-sorgula">Sipariş sorgula</Link>
        </div>
        <div>
          <h4>Koku aileleri</h4>
          {KOKU_AILELERI.map((k) => (
            <Link key={k.ad} to={`/parfumler?kokuAilesi=${encodeURIComponent(k.ad)}`}>
              {k.ad}
            </Link>
          ))}
        </div>
      </div>
      <div className="alt-cizgi">© {YIL} Esans · Enes</div>
    </footer>
  );
}
