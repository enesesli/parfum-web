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

async function istek(yol, { method = "GET", govde, token } = {}) {
  const basliklar = {};
  if (govde !== undefined) basliklar["Content-Type"] = "application/json";
  if (token) basliklar.Authorization = `Bearer ${token}`;

  const cevap = await fetch(`${API}${yol}`, {
    method,
    headers: basliklar,
    body: govde !== undefined ? JSON.stringify(govde) : undefined,
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
