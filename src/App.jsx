import { Routes, Route, Link } from "react-router-dom";
import ParfumListesi from "./pages/ParfumListesi";
import ParfumDetay from "./pages/ParfumDetay";
import Sepet from "./pages/Sepet";
import Giris from "./pages/Giris";
import Admin from "./pages/Admin";
import KorumaliRoute from "./components/KorumaliRoute";
import { useSepet } from "./context/SepetContext";
import { useAuth } from "./context/AuthContext";

function App() {
  const { toplamAdet } = useSepet();
  const { girisYapildi, cikis } = useAuth();

  return (
    <>
      <header className="ust-bar">
        <Link to="/" className="logo">
          Esans
        </Link>

        <nav className="ust-menu">
          <Link to="/admin">Yönetim</Link>
          {girisYapildi && (
            <button className="link-buton" onClick={() => cikis()}>
              Çıkış
            </button>
          )}
          <Link to="/sepet" className="sepet-link">
            Sepet
            {toplamAdet > 0 && <span className="rozet">{toplamAdet}</span>}
          </Link>
        </nav>
      </header>

      <main className="icerik">
        <Routes>
          <Route path="/" element={<ParfumListesi />} />
          <Route path="/parfum/:id" element={<ParfumDetay />} />
          <Route path="/sepet" element={<Sepet />} />
          <Route path="/giris" element={<Giris />} />
          <Route
            path="/admin"
            element={
              <KorumaliRoute>
                <Admin />
              </KorumaliRoute>
            }
          />
          <Route path="*" element={<p>Sayfa bulunamadı.</p>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
