import { createContext, useContext, useEffect, useState } from "react";

const SepetContext = createContext(null);
const ANAHTAR = "sepet";

function kayitliSepetiOku() {
  try {
    return JSON.parse(localStorage.getItem(ANAHTAR)) ?? [];
  } catch {
    return [];
  }
}

export function SepetProvider({ children }) {
  const [urunler, setUrunler] = useState(kayitliSepetiOku);

  // Sepet her değiştiğinde tarayıcıya kaydet
  useEffect(() => {
    try {
      localStorage.setItem(ANAHTAR, JSON.stringify(urunler));
    } catch {
      // Gizli sekme gibi durumlarda kayıt yapılamayabilir, sorun değil
    }
  }, [urunler]);

  function ekle(parfum) {
    setUrunler((onceki) => {
      const mevcut = onceki.find((u) => u.id === parfum.id);
      if (mevcut) {
        return onceki.map((u) =>
          u.id === parfum.id ? { ...u, adet: Math.min(u.adet + 1, u.stok) } : u,
        );
      }
      return [
        ...onceki,
        {
          id: parfum.id,
          ad: parfum.ad,
          marka: parfum.marka,
          fiyat: parfum.fiyat,
          stok: parfum.stok,
          renk: parfum.renk,
          siseTipi: parfum.siseTipi,
          gorselYolu: parfum.gorselYolu,
          adet: 1,
        },
      ];
    });
  }

  // Atölyede tasarlanan parfüm: katalogda karşılığı olmadığı için kendi kimliğini alır
  function ozelEkle(parfum) {
    setUrunler((onceki) => [
      ...onceki,
      { ...parfum, id: `ozel-${Date.now()}`, ozel: true, stok: 5, adet: 1 },
    ]);
  }

  function adetDegistir(id, adet) {
    setUrunler((onceki) =>
      onceki.map((u) =>
        u.id === id ? { ...u, adet: Math.max(1, Math.min(adet, u.stok)) } : u,
      ),
    );
  }

  function cikar(id) {
    setUrunler((onceki) => onceki.filter((u) => u.id !== id));
  }

  function temizle() {
    setUrunler([]);
  }

  const toplamAdet = urunler.reduce((toplam, u) => toplam + u.adet, 0);
  const toplamTutar = urunler.reduce(
    (toplam, u) => toplam + u.adet * u.fiyat,
    0,
  );

  return (
    <SepetContext.Provider
      value={{
        urunler,
        ekle,
        ozelEkle,
        adetDegistir,
        cikar,
        temizle,
        toplamAdet,
        toplamTutar,
      }}
    >
      {children}
    </SepetContext.Provider>
  );
}

export function useSepet() {
  const ctx = useContext(SepetContext);
  if (!ctx) throw new Error("useSepet, SepetProvider içinde kullanılmalı");
  return ctx;
}
