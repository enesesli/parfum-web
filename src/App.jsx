import { Routes, Route, Link } from "react-router-dom";
import ParfumListesi from "./pages/ParfumListesi";
import ParfumDetay from "./pages/ParfumDetay";

function App() {
  return (
    <>
      <header className="ust-bar">
        <Link to="/" className="logo">
          Esans
        </Link>
      </header>

      <main className="icerik">
        <Routes>
          <Route path="/" element={<ParfumListesi />} />
          <Route path="/parfum/:id" element={<ParfumDetay />} />
          <Route path="*" element={<p>Sayfa bulunamadı.</p>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
