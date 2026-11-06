// Birden fazla bileşenin kullandığı küçük yardımcılar ve sabitler

export function fiyatYaz(fiyat) {
  return Number(fiyat).toLocaleString("tr-TR", { maximumFractionDigits: 2 }) + " ₺";
}

export function indirimOrani(parfum) {
  if (!parfum.eskiFiyat || parfum.eskiFiyat <= parfum.fiyat) return 0;
  return Math.round((1 - parfum.fiyat / parfum.eskiFiyat) * 100);
}

// "Armut, Bergamot" -> ["Armut", "Bergamot"]
export function notalariAyir(metin) {
  return (metin ?? "")
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);
}

function hexOku(hex) {
  const temiz = /^#[0-9a-f]{6}$/i.test(hex ?? "") ? hex : "#c9a77c";
  return [1, 3, 5].map((i) => parseInt(temiz.slice(i, i + 2), 16));
}

// İki rengi karıştırır. oran 0 ise ilk renk, 1 ise hedef renk.
export function renkKaristir(hex, hedef, oran) {
  const a = hexOku(hex);
  const b = hexOku(hedef);
  const sonuc = a.map((k, i) => Math.round(k + (b[i] - k) * oran));
  return "#" + sonuc.map((k) => k.toString(16).padStart(2, "0")).join("");
}

export const KOKU_AILELERI = [
  { ad: "Çiçeksi", aciklama: "Gül, yasemin, şakayık", renk: "#e3a9b8" },
  { ad: "Odunsu", aciklama: "Sedir, vetiver, sandal", renk: "#8a6a4f" },
  { ad: "Oryantal", aciklama: "Amber, ud, baharat", renk: "#9b4a2f" },
  { ad: "Ferah", aciklama: "Narenciye, deniz, yeşillik", renk: "#86b7c6" },
  { ad: "Gurme", aciklama: "Vanilya, kahve, pralin", renk: "#c4925f" },
  { ad: "Aromatik", aciklama: "Lavanta, çay, otlar", renk: "#6f8f6a" },
];

export const KONSANTRASYONLAR = ["Eau de Toilette", "Eau de Parfum", "Extrait de Parfum"];

export const KISA_KONSANTRASYON = {
  "Eau de Toilette": "EDT",
  "Eau de Parfum": "EDP",
  "Extrait de Parfum": "Extrait",
};

export const SISE_TIPLERI = ["Klasik", "Yuvarlak", "İnce", "Faset", "Geniş"];

// Birden fazla rengin ortalaması (atölyede sıvı rengi seçilen esanslardan oluşur)
export function renkOrtalamasi(renkler, varsayilan = "#e8dcc8") {
  if (renkler.length === 0) return varsayilan;
  const toplam = [0, 0, 0];
  for (const renk of renkler) hexOku(renk).forEach((k, i) => (toplam[i] += k));
  return (
    "#" +
    toplam.map((k) => Math.round(k / renkler.length).toString(16).padStart(2, "0")).join("")
  );
}

// Kargo kuralı API ile aynı; sepette tahmini göstermek için. Kesin tutarı her zaman sunucu hesaplar.
export const UCRETSIZ_KARGO_SINIRI = 2000;
export const KARGO_UCRETI = 150;

export function kargoHesapla(araToplam) {
  return araToplam >= UCRETSIZ_KARGO_SINIRI ? 0 : KARGO_UCRETI;
}

export function tarihYaz(tarih) {
  return new Date(tarih).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
}

// Sepet kalemini API'nin beklediği biçime çevirir
export function siparisKalemi(u) {
  if (!u.ozel) return { parfumId: u.id, adet: u.adet };
  return {
    adet: u.adet,
    ozel: { ad: u.ad, esansIdleri: u.esansIdleri, konsantrasyon: u.konsantrasyon, hacimMl: u.hacimMl },
  };
}

// Atölyenin eski sürümünde eklenen özel parfümlerde tarif bilgisi yok, siparişe gönderilemez
export const eksikOzelKalemMi = (u) => u.ozel && !(u.esansIdleri?.length >= 2);
