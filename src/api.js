const API = import.meta.env.VITE_API_URL;

async function getir(yol) {
  const cevap = await fetch(`${API}${yol}`);
  if (!cevap.ok) {
    const hata = new Error("İstek başarısız");
    hata.durum = cevap.status;
    throw hata;
  }
  return cevap.json();
}

export const parfumleriGetir = (sorgu) => getir(`/api/parfumler?${sorgu}`);
export const parfumGetir = (id) => getir(`/api/parfumler/${id}`);
export const markalariGetir = () => getir("/api/markalar");
