import { Routes, Route } from "react-router-dom";
import AnaSayfa from "./pages/AnaSayfa";
import ParfumListesi from "./pages/ParfumListesi";
import ParfumDetay from "./pages/ParfumDetay";
import Sepet from "./pages/Sepet";
import KokuAtolyesi from "./pages/KokuAtolyesi";
import Odeme from "./pages/Odeme";
import SiparisDetay from "./pages/SiparisDetay";
import SiparisSorgula from "./pages/SiparisSorgula";
import Giris from "./pages/Giris";
import Admin from "./pages/Admin";
import KorumaliRoute from "./components/KorumaliRoute";
import { Ust, Alt } from "./components/Duzen";

function App() {
  return (
    <>
      <Ust />

      <main className="icerik">
        <Routes>
          <Route path="/" element={<AnaSayfa />} />
          <Route path="/parfumler" element={<ParfumListesi />} />
          <Route path="/parfum/:id" element={<ParfumDetay />} />
          <Route path="/sepet" element={<Sepet />} />
          <Route path="/kendi-kokun" element={<KokuAtolyesi />} />
          <Route path="/odeme" element={<Odeme />} />
          <Route path="/siparis/:siparisNo" element={<SiparisDetay />} />
          <Route path="/siparis-sorgula" element={<SiparisSorgula />} />
          <Route path="/giris" element={<Giris />} />
          <Route
            path="/admin"
            element={
              <KorumaliRoute>
                <Admin />
              </KorumaliRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="sayfa-genis bos-durum">
                <h1>Sayfa bulunamadı</h1>
              </div>
            }
          />
        </Routes>
      </main>

      <Alt />
    </>
  );
}

export default App;
