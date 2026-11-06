import { useEffect, useState } from "react";
import { gorselAdresi } from "../api";
import SiseGorseli from "./SiseGorseli";
import { KOKU_AILELERI, KONSANTRASYONLAR, SISE_TIPLERI, renkKaristir } from "../yardimci";

const BOS_FORM = {
  ad: "",
  aciklama: "",
  fiyat: "",
  eskiFiyat: "",
  hacimMl: "100",
  cinsiyet: "Unisex",
  stok: "",
  markaId: "",
  kokuAilesi: "Çiçeksi",
  konsantrasyon: "Eau de Parfum",
  ustNotalar: "",
  kalpNotalar: "",
  altNotalar: "",
  renk: "#c9a77c",
  siseTipi: 0,
  yeni: true,
};

// Input'lar metinle çalışır; API'den gelen sayıları metne çeviriyoruz
function formaCevir(p) {
  if (!p) return BOS_FORM;
  return {
    ad: p.ad,
    aciklama: p.aciklama,
    fiyat: String(p.fiyat),
    eskiFiyat: p.eskiFiyat == null ? "" : String(p.eskiFiyat),
    hacimMl: String(p.hacimMl),
    cinsiyet: p.cinsiyet,
    stok: String(p.stok),
    markaId: String(p.markaId),
    kokuAilesi: p.kokuAilesi,
    konsantrasyon: p.konsantrasyon,
    ustNotalar: p.ustNotalar,
    kalpNotalar: p.kalpNotalar,
    altNotalar: p.altNotalar,
    renk: p.renk,
    siseTipi: p.siseTipi,
    yeni: p.yeni,
  };
}

function ParfumFormu({ baslangic, markalar, onKaydet, onIptal }) {
  const [form, setForm] = useState(() => formaCevir(baslangic));
  const [hata, setHata] = useState("");
  const [kaydediliyor, setKaydediliyor] = useState(false);

  // Görsel: yeni seçilen dosya ya da mevcut görseli kaldırma isteği
  const [dosya, setDosya] = useState(null);
  const [onizlemeUrl, setOnizlemeUrl] = useState(null);
  const [gorseliKaldir, setGorseliKaldir] = useState(false);

  // Seçilen dosya için geçici bir önizleme adresi oluştur, iş bitince bellekten sil
  useEffect(() => {
    if (!dosya) {
      setOnizlemeUrl(null);
      return;
    }
    const url = URL.createObjectURL(dosya);
    setOnizlemeUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [dosya]);

  function dosyaSec(e) {
    const secilen = e.target.files?.[0] ?? null;
    setHata("");
    if (secilen && secilen.size > 5 * 1024 * 1024) {
      setHata("Görsel en fazla 5 MB olabilir.");
      e.target.value = "";
      return;
    }
    setDosya(secilen);
    if (secilen) setGorseliKaldir(false);
  }

  const mevcutGorsel = baslangic?.gorselYolu && !gorseliKaldir ? gorselAdresi(baslangic.gorselYolu) : null;
  const gosterilecekGorsel = onizlemeUrl ?? mevcutGorsel;

  function alanDegistir(ad, deger) {
    setForm((onceki) => ({ ...onceki, [ad]: deger }));
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    alanDegistir(name, type === "checkbox" ? checked : value);
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
      eskiFiyat: form.eskiFiyat === "" ? null : Number(form.eskiFiyat),
      hacimMl: Number(form.hacimMl),
      cinsiyet: form.cinsiyet,
      stok: Number(form.stok),
      markaId: Number(form.markaId),
      kokuAilesi: form.kokuAilesi,
      konsantrasyon: form.konsantrasyon,
      ustNotalar: form.ustNotalar.trim(),
      kalpNotalar: form.kalpNotalar.trim(),
      altNotalar: form.altNotalar.trim(),
      renk: form.renk,
      siseTipi: Number(form.siseTipi),
      yeni: form.yeni,
    };

    try {
      await onKaydet(veri, { dosya, kaldir: gorseliKaldir });
    } catch (err) {
      setHata(err.message || "Kaydedilemedi.");
    } finally {
      setKaydediliyor(false);
    }
  }

  const markaAdi = markalar.find((m) => String(m.id) === form.markaId)?.ad ?? "Esans";

  return (
    <form className="parfum-formu" onSubmit={handleSubmit}>
      <div className="form-alanlar">
        <h2 className="genis">{baslangic ? `Düzenle: ${baslangic.ad}` : "Yeni parfüm"}</h2>

        <label className="genis">
          Ad
          <input name="ad" value={form.ad} onChange={handleChange} required maxLength={100} />
        </label>

        <label className="genis">
          Açıklama
          <textarea name="aciklama" rows="2" value={form.aciklama} onChange={handleChange} maxLength={500} />
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
          Koku ailesi
          <select name="kokuAilesi" value={form.kokuAilesi} onChange={handleChange}>
            {KOKU_AILELERI.map((k) => (
              <option key={k.ad} value={k.ad}>
                {k.ad}
              </option>
            ))}
          </select>
        </label>

        <label>
          Konsantrasyon
          <select name="konsantrasyon" value={form.konsantrasyon} onChange={handleChange}>
            {KONSANTRASYONLAR.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>

        <label>
          Kimin için
          <select name="cinsiyet" value={form.cinsiyet} onChange={handleChange}>
            <option value="Kadın">Kadın</option>
            <option value="Erkek">Erkek</option>
            <option value="Unisex">Unisex</option>
          </select>
        </label>

        <label>
          Satış fiyatı (₺)
          <input name="fiyat" type="number" min="1" step="0.01" value={form.fiyat} onChange={handleChange} required />
        </label>

        <label>
          Eski fiyat (₺) <small>indirim varsa</small>
          <input name="eskiFiyat" type="number" min="1" step="0.01" value={form.eskiFiyat} onChange={handleChange} />
        </label>

        <label>
          Hacim (ml)
          <input name="hacimMl" type="number" min="1" max="500" value={form.hacimMl} onChange={handleChange} required />
        </label>

        <label>
          Stok
          <input name="stok" type="number" min="0" value={form.stok} onChange={handleChange} required />
        </label>

        <label className="genis">
          Üst notalar <small>virgülle ayır</small>
          <input name="ustNotalar" value={form.ustNotalar} onChange={handleChange} maxLength={200} placeholder="Bergamot, Armut" />
        </label>
        <label className="genis">
          Kalp notaları
          <input name="kalpNotalar" value={form.kalpNotalar} onChange={handleChange} maxLength={200} placeholder="Gül, Yasemin" />
        </label>
        <label className="genis">
          Alt notalar
          <input name="altNotalar" value={form.altNotalar} onChange={handleChange} maxLength={200} placeholder="Misk, Sedir" />
        </label>

        <label className="onay genis">
          <input type="checkbox" name="yeni" checked={form.yeni} onChange={handleChange} />
          "Yeni" rozeti göster
        </label>

        {hata && <p className="hata genis">{hata}</p>}

        <div className="form-butonlar genis">
          <button type="button" className="buton ikincil" onClick={onIptal}>
            Vazgeç
          </button>
          <button type="submit" className="buton" disabled={kaydediliyor}>
            {kaydediliyor ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>

      <div className="form-onizleme">
        <span className="ust-baslik">Görsel önizleme</span>
        <div className="onizleme-kutu" style={{ "--ton": renkKaristir(form.renk, "#ffffff", 0.82) }}>
          {gosterilecekGorsel ? (
            <img className="urun-foto" src={gosterilecekGorsel} alt="Ürün görseli önizlemesi" />
          ) : (
            <SiseGorseli renk={form.renk} tip={Number(form.siseTipi)} harf={markaAdi.charAt(0)} />
          )}
        </div>

        <div className="gorsel-alani">
          <label className="buton ikincil kucuk dosya-sec">
            {gosterilecekGorsel ? "Görseli değiştir" : "Görsel yükle"}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={dosyaSec} hidden />
          </label>
          {dosya && (
            <button type="button" className="link-buton" onClick={() => setDosya(null)}>
              Seçimi iptal et
            </button>
          )}
          {!dosya && baslangic?.gorselYolu && !gorseliKaldir && (
            <button type="button" className="link-buton" onClick={() => setGorseliKaldir(true)}>
              Görseli kaldır
            </button>
          )}
          {gorseliKaldir && (
            <span className="soluk kucuk">
              Kaydedince görsel kaldırılacak.{" "}
              <button type="button" className="link-buton" onClick={() => setGorseliKaldir(false)}>
                Geri al
              </button>
            </span>
          )}
          <p className="soluk kucuk">
            JPG, PNG veya WEBP, en fazla 5 MB. Görsel yoksa aşağıdaki renk ve şişe biçimiyle çizim
            gösterilir.
          </p>
        </div>

        <label>
          Sıvı rengi
          <div className="renk-secici">
            <input name="renk" type="color" value={form.renk} onChange={handleChange} />
            <code>{form.renk}</code>
          </div>
        </label>

        <fieldset className="sise-secici">
          <legend>Şişe biçimi</legend>
          {SISE_TIPLERI.map((ad, i) => (
            <button
              type="button"
              key={ad}
              className={Number(form.siseTipi) === i ? "sise-secenek secili" : "sise-secenek"}
              aria-pressed={Number(form.siseTipi) === i}
              onClick={() => alanDegistir("siseTipi", i)}
              title={ad}
            >
              <SiseGorseli renk={form.renk} tip={i} harf="" />
              <span>{ad}</span>
            </button>
          ))}
        </fieldset>
      </div>
    </form>
  );
}

export default ParfumFormu;
