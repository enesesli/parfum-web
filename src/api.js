const API = import.meta.env.VITE_API_URL;

// API'nin döndürdüğü hatayı okunabilir bir mesaja çevirir
async function hataOlustur(cevap) {
  let mesaj = "İstek başarısız oldu.";
  try {
    const metin = await cevap.text();
    if (metin) {
      try {
        const veri = JSON.parse(metin);
        if (veri.errors) {
          // [ApiController] doğrulama hataları (ProblemDetails): alan alan mesajlar
          mesaj = Object.values(veri.errors).flat().join(" ");
        } else if (typeof veri === "string") {
          mesaj = veri;
        } else if (veri.title) {
          mesaj = veri.title;
        }
      } catch {
        // JSON değilse düz metindir, örn. BadRequest("...") mesajı
        mesaj = metin;
      }
    }
  } catch {
    // Gövde okunamadıysa varsayılan mesaj kalır
  }
  const hata = new Error(mesaj);
  hata.durum = cevap.status;
  return hata;
}

async function istek(yol, { method = "GET", govde, token, signal } = {}) {
  const basliklar = {};
  const formMu = govde instanceof FormData;
  if (govde !== undefined && !formMu) basliklar["Content-Type"] = "application/json";
  if (token) basliklar.Authorization = `Bearer ${token}`;

  const cevap = await fetch(`${API}${yol}`, {
    method,
    headers: basliklar,
    // FormData (dosya yükleme) olduğu gibi gönderilir; tarayıcı sınırları kendisi ayarlar
    body: govde === undefined ? undefined : formMu ? govde : JSON.stringify(govde),
    signal,
  });

  if (!cevap.ok) throw await hataOlustur(cevap);
  if (cevap.status === 204) return null; // PUT ve DELETE gövde döndürmez
  return cevap.json();
}

// Herkese açık
export const parfumleriGetir = (sorgu) => istek(`/api/parfumler?${sorgu}`);
export const parfumGetir = (id) => istek(`/api/parfumler/${id}`);
export const markalariGetir = () => istek("/api/markalar");

// Giriş
export const girisYap = (kullaniciAdi, sifre) =>
  istek("/api/auth/giris", { method: "POST", govde: { kullaniciAdi, sifre } });

// Sadece admin (token gerekir)
export const parfumEkle = (parfum, token) =>
  istek("/api/parfumler", { method: "POST", govde: parfum, token });

export const parfumGuncelle = (id, parfum, token) =>
  istek(`/api/parfumler/${id}`, { method: "PUT", govde: parfum, token });

export const parfumSil = (id, token) =>
  istek(`/api/parfumler/${id}`, { method: "DELETE", token });

// Koku atölyesi
export const esanslariGetir = () => istek("/api/esanslar");

export const kokuDegerlendir = (secim, signal) =>
  istek("/api/esanslar/degerlendir", { method: "POST", govde: secim, signal });

// Ürün görselleri
export const gorselAdresi = (yol) => (yol ? `${API}${yol}` : null);

export function gorselYukle(id, dosya, token) {
  const form = new FormData();
  form.append("dosya", dosya);
  return istek(`/api/parfumler/${id}/gorsel`, { method: "POST", govde: form, token });
}

export const gorselSil = (id, token) =>
  istek(`/api/parfumler/${id}/gorsel`, { method: "DELETE", token });

// Siparişler ve ödeme
export const siparisOlustur = (istek) => istek_("/api/siparisler", "POST", istek);

export const siparisGetir = (siparisNo, eposta) =>
  istek(`/api/siparisler/${encodeURIComponent(siparisNo)}?eposta=${encodeURIComponent(eposta)}`);

export const kartIleOde = (siparisNo, odeme) =>
  istek_(`/api/siparisler/${siparisNo}/odeme/kart`, "POST", odeme);

export const kriptoFaturaOlustur = (siparisNo, eposta, para) =>
  istek_(`/api/siparisler/${siparisNo}/odeme/kripto`, "POST", { eposta, para });

export const kriptoOdemesiniSimuleEt = (siparisNo, eposta) =>
  istek_(`/api/siparisler/${siparisNo}/odeme/kripto/simule-et`, "POST", { eposta });

// Yönetici
export const siparisleriGetir = (sorgu, token) => istek(`/api/siparisler?${sorgu}`, { token });

export const siparisDurumGuncelle = (id, durum, token) =>
  istek(`/api/siparisler/${id}/durum`, { method: "PUT", govde: { durum }, token });

function istek_(yol, method, govde) {
  return istek(yol, { method, govde });
}
