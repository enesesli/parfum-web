import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { girisYap } from "../api";
import { useAuth } from "../context/AuthContext";

function Giris() {
  const { girisYapildi, girisKaydet, cikisMesaji } = useAuth();
  const navigate = useNavigate();
  const konum = useLocation();
  const hedef = konum.state?.geri ?? "/admin";

  const [form, setForm] = useState({ kullaniciAdi: "", sifre: "" });
  const [hata, setHata] = useState(cikisMesaji);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  // Zaten giriş yapılmışsa formu göstermeye gerek yok
  if (girisYapildi) return <Navigate to={hedef} replace />;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((onceki) => ({ ...onceki, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setHata("");
    setGonderiliyor(true);

    try {
      const sonuc = await girisYap(form.kullaniciAdi, form.sifre);
      girisKaydet(sonuc);
      navigate(hedef, { replace: true });
    } catch (err) {
      setHata(
        err.durum === 401
          ? "Kullanıcı adı veya şifre hatalı."
          : "Sunucuya ulaşılamadı. API çalışıyor mu?",
      );
    } finally {
      setGonderiliyor(false);
    }
  }

  return (
    <form className="giris-formu" onSubmit={handleSubmit}>
      <h1>Yönetici girişi</h1>

      <label>
        Kullanıcı adı
        <input
          name="kullaniciAdi"
          autoComplete="username"
          value={form.kullaniciAdi}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Şifre
        <input
          name="sifre"
          type="password"
          autoComplete="current-password"
          value={form.sifre}
          onChange={handleChange}
          required
        />
      </label>

      {hata && <p className="hata">{hata}</p>}

      <button type="submit" className="buton tam" disabled={gonderiliyor}>
        {gonderiliyor ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>
    </form>
  );
}

export default Giris;
