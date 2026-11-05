import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const ANAHTAR = "oturum";

function suresiDolmamis(oturum) {
  return oturum !== null && new Date(oturum.bitis) > new Date();
}

function kayitliOturumuOku() {
  try {
    const oturum = JSON.parse(localStorage.getItem(ANAHTAR));
    if (oturum && suresiDolmamis(oturum)) return oturum;
  } catch {
    // Bozuk kayıt varsa yok sayıyoruz
  }
  return null;
}

export function AuthProvider({ children }) {
  // oturum: { token, kullaniciAdi, bitis } ya da null
  const [oturum, setOturum] = useState(kayitliOturumuOku);

  // Oturum kendiliğinden kapandıysa giriş sayfasında gösterilecek açıklama
  const [cikisMesaji, setCikisMesaji] = useState("");

  function girisKaydet(sonuc) {
    setOturum(sonuc);
    setCikisMesaji("");
    try {
      localStorage.setItem(ANAHTAR, JSON.stringify(sonuc));
    } catch {
      // Kaydedilemezse oturum sadece bu sekme açıkken geçerli olur
    }
  }

  function cikis(mesaj = "") {
    setOturum(null);
    setCikisMesaji(mesaj);
    try {
      localStorage.removeItem(ANAHTAR);
    } catch {
      // Sorun değil
    }
  }

  const girisYapildi = suresiDolmamis(oturum);

  return (
    <AuthContext.Provider
      value={{
        token: girisYapildi ? oturum.token : null,
        kullaniciAdi: girisYapildi ? oturum.kullaniciAdi : null,
        girisYapildi,
        cikisMesaji,
        girisKaydet,
        cikis,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, AuthProvider içinde kullanılmalı");
  return ctx;
}
