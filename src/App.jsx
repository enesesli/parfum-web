import { Routes, Route, Link } from "react-router-dom";
import ParfumListesi from "./pages/ParfumListesi";
import ParfumDetay from "./pages/ParfumDetay";
import Sepet from "./pages/Sepet";
import { useSepet } from "./context/SepetContext";

function App() {
  const { toplamAdet } = useSepet();

  return (
    <>
      <header className="ust-bar">
        <Link to="/" className="logo">
          Esans
        </Link>
        <Link to="/sepet" className="sepet-link">
          Sepet
          {toplamAdet > 0 && <span className="rozet">{toplamAdet}</span>}
        </Link>
      </header>

      <main className="icerik">
        <Routes>
          <Route path="/" element={<ParfumListesi />} />
          <Route path="/parfum/:id" element={<ParfumDetay />} />
          <Route path="/sepet" element={<Sepet />} />
          <Route path="*" element={<p>Sayfa bulunamadı.</p>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
