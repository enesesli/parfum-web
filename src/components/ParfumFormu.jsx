import { useState } from "react";

const BOS_FORM = {
  ad: "",
  aciklama: "",
  fiyat: "",
  hacimMl: "",
  cinsiyet: "Kadın",
  stok: "",
  markaId: "",
};

// Input'lar metinle çalışır; API'den gelen sayıları metne çeviriyoruz
function formaCevir(parfum) {
  if (!parfum) return BOS_FORM;
  return {
    ad: parfum.ad,
    aciklama: parfum.aciklama,
    fiyat: String(parfum.fiyat),
    hacimMl: String(parfum.hacimMl),
    cinsiyet: parfum.cinsiyet,
    stok: String(parfum.stok),
    markaId: String(parfum.markaId),
  };
}

function ParfumFormu({ baslangic, markalar, onKaydet, onIptal }) {
  const [form, setForm] = useState(() => formaCevir(baslangic));
  const [hata, setHata] = useState("");
  const [kaydediliyor, setKaydediliyor] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((onceki) => ({ ...onceki, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setHata("");
    setKaydediliyor(true);

    // API'nin beklediği tiplere çevir (ParfumKaydetDto)
    const veri = {
      ad: form.ad.trim(),
      aciklama: form.aciklama.trim(),
      fiyat: Number(form.fiyat),
      hacimMl: Number(form.hacimMl),
      cinsiyet: form.cinsiyet,
      stok: Number(form.stok),
      markaId: Number(form.markaId),
    };

    try {
      await onKaydet(veri);
    } catch (err) {
      setHata(err.message || "Kaydedilemedi.");
    } finally {
      setKaydediliyor(false);
    }
  }

  return (
    <form className="parfum-formu" onSubmit={handleSubmit}>
      <h2>{baslangic ? `Düzenle: ${baslangic.ad}` : "Yeni parfüm"}</h2>

      <label className="genis">
        Ad
        <input name="ad" value={form.ad} onChange={handleChange} required maxLength={100} />
      </label>

      <label className="genis">
        Açıklama
        <textarea
          name="aciklama"
          rows="3"
          value={form.aciklama}
          onChange={handleChange}
          maxLength={500}
        />
      </label>

      <label>
        Marka
        <select name="markaId" value={form.markaId} onChange={handleChange} required>
          <option value="">Seçin</option>
          {markalar.map((m) => (
            <option key={m.id} value={m.id}>
              {m.ad}
            </option>
          ))}
        </select>
      </label>

      <label>
        Cinsiyet
        <select name="cinsiyet" value={form.cinsiyet} onChange={handleChange}>
          <option value="Kadın">Kadın</option>
          <option value="Erkek">Erkek</option>
          <option value="Unisex">Unisex</option>
        </select>
      </label>

      <label>
        Fiyat (₺)
        <input
          name="fiyat"
          type="number"
          min="1"
          step="0.01"
          value={form.fiyat}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Hacim (ml)
        <input
          name="hacimMl"
          type="number"
          min="1"
          max="500"
          value={form.hacimMl}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Stok
        <input
          name="stok"
          type="number"
          min="0"
          value={form.stok}
          onChange={handleChange}
          required
        />
      </label>

      {hata && <p className="hata genis">{hata}</p>}

      <div className="form-butonlar genis">
        <button type="button" className="ikincil-buton" onClick={onIptal}>
          Vazgeç
        </button>
        <button type="submit" disabled={kaydediliyor}>
          {kaydediliyor ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}

export default ParfumFormu;
