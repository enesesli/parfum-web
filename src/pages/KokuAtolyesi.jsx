import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { esanslariGetir, kokuDegerlendir } from "../api";
import { useSepet } from "../context/SepetContext";
import SiseGorseli from "../components/SiseGorseli";
import EsansIkonu from "../components/EsansIkonu";
import {
  fiyatYaz,
  KISA_KONSANTRASYON,
  KONSANTRASYONLAR,
  renkKaristir,
  renkOrtalamasi,
  SISE_TIPLERI,
} from "../yardimci";

const KATMANLAR = [
  { ad: "Üst", baslik: "Üst notalar", aciklama: "İlk izlenim. İlk 15 dakikada hissedilir." },
  { ad: "Kalp", baslik: "Kalp notaları", aciklama: "Kokunun karakteri. Birkaç saat sürer." },
  { ad: "Alt", baslik: "Alt notalar", aciklama: "Tende kalan iz. Saatlerce kalır." },
];
const KATMAN_SINIRI = 3;
const HACIMLER = [30, 50, 100];

// Başlangıç için hazır tarifler (esans adlarıyla)
const HAZIR_TARIFLER = [
  { ad: "Ferah gündüz", esanslar: ["Bergamot", "Greyfurt", "Yeşil çay", "Lavanta", "Vetiver", "Beyaz misk"] },
  { ad: "Romantik akşam", esanslar: ["Pembe biber", "Ahududu", "Gül", "Safran", "Ud", "Amber"] },
  { ad: "Tatlı ve sıcak", esanslar: ["Mandalina", "Portakal çiçeği", "Tarçın", "Vanilya", "Tonka"] },
  { ad: "Modern odunsu", esanslar: ["Kakule", "Süsen", "Adaçayı", "Sedir", "Sandal ağacı", "Tütsü"] },
];

// Seçilmemiş bir esansın mevcut seçimle ortalama uyumunu (-2..2) etikete çevirir
function uyumEtiketi(puan) {
  if (puan === undefined) return null;
  if (puan >= 1.2) return { metin: "Çok uyumlu", sinif: "iyi" };
  if (puan >= 0.5) return { metin: "Uyumlu", sinif: "orta-iyi" };
  if (puan <= -1.5) return { metin: "Çatışır", sinif: "kotu" };
  if (puan <= -0.5) return { metin: "Riskli", sinif: "riskli" };
  return null;
}

function puanRengi(puan) {
  if (puan >= 80) return "#2e6b45";
  if (puan >= 65) return "#6b8a3a";
  if (puan >= 45) return "#b7832f";
  return "#a8322a";
}

function KokuAtolyesi() {
  const { ozelEkle } = useSepet();

  const [esanslar, setEsanslar] = useState([]);
  const [yuklemeHatasi, setYuklemeHatasi] = useState("");
  const [secili, setSecili] = useState([]); // esans id'leri
  const [aktifKatman, setAktifKatman] = useState("Üst");

  const [ad, setAd] = useState("");
  const [konsantrasyon, setKonsantrasyon] = useState("Eau de Parfum");
  const [hacim, setHacim] = useState(50);
  const [siseTipi, setSiseTipi] = useState(1);

  const [sonuc, setSonuc] = useState(null);
  const [hesaplaniyor, setHesaplaniyor] = useState(false);
  const [hata, setHata] = useState("");
  const [eklendi, setEklendi] = useState(false);

  useEffect(() => {
    esanslariGetir()
      .then(setEsanslar)
      .catch(() => setYuklemeHatasi("Esanslar yüklenemedi. API çalışıyor mu?"));
  }, []);

  // Seçim her değiştiğinde API'ye uyumu hesaplat.
  // Hızlı tıklamalarda eski istekleri iptal ediyoruz ki ekrana eski sonuç gelmesin.
  useEffect(() => {
    if (secili.length === 0) {
      setSonuc(null);
      setHata("");
      return;
    }

    const anahtar = JSON.stringify([secili, konsantrasyon, hacim]);
    const iptal = new AbortController();
    const zamanlayici = setTimeout(() => {
      setHesaplaniyor(true);
      kokuDegerlendir({ esansIdleri: secili, konsantrasyon, hacimMl: hacim }, iptal.signal)
        .then((s) => {
          setSonuc({ ...s, anahtar });
          setHata("");
        })
        .catch((err) => {
          if (err.name !== "AbortError") setHata(err.message || "Uyum hesaplanamadı.");
        })
        .finally(() => setHesaplaniyor(false));
    }, 150);

    return () => {
      clearTimeout(zamanlayici);
      iptal.abort();
    };
  }, [secili, konsantrasyon, hacim]);

  const esansHaritasi = useMemo(() => new Map(esanslar.map((e) => [e.id, e])), [esanslar]);
  const seciliEsanslar = secili.map((id) => esansHaritasi.get(id)).filter(Boolean);
  const katmandakiSayi = (katman) => seciliEsanslar.filter((e) => e.katman === katman).length;

  const sivirengi = renkOrtalamasi(seciliEsanslar.map((e) => e.renk));
  const parfumAdi = ad.trim() || "Benim kokum";

  function degistir(esans) {
    setEklendi(false);
    setSecili((onceki) => {
      if (onceki.includes(esans.id)) return onceki.filter((id) => id !== esans.id);
      const ayniKatman = onceki.filter((id) => esansHaritasi.get(id)?.katman === esans.katman);
      if (ayniKatman.length >= KATMAN_SINIRI) return onceki;
      return [...onceki, esans.id];
    });
  }

  function tarifUygula(tarif) {
    const idler = tarif.esanslar
      .map((ad) => esanslar.find((e) => e.ad === ad)?.id)
      .filter(Boolean);
    setSecili(idler);
    setEklendi(false);
    if (!ad.trim()) setAd(tarif.ad);
  }

  function temizle() {
    setSecili([]);
    setEklendi(false);
  }

  function sepeteEkle() {
    const tarif = KATMANLAR.map((k) =>
      seciliEsanslar
        .filter((e) => e.katman === k.ad)
        .map((e) => e.ad)
        .join(", "),
    )
      .filter(Boolean)
      .join(" · ");

    ozelEkle({
      ad: parfumAdi,
      marka: "Esans Atölye",
      fiyat: sonuc.fiyat,
      renk: sivirengi,
      siseTipi,
      tarif: `${KISA_KONSANTRASYON[konsantrasyon]} ${hacim} ml · ${tarif}`,
      // Sipariş verilirken fiyat bu tariften sunucuda yeniden hesaplanır
      esansIdleri: secili,
      konsantrasyon,
      hacimMl: hacim,
    });
    setEklendi(true);
  }

  const katmanBilgisi = KATMANLAR.find((k) => k.ad === aktifKatman);
  const gorunenEsanslar = esanslar.filter((e) => e.katman === aktifKatman);
  const yeterliSecim = secili.length >= 2;
  // Ekrandaki sonuç, şu anki seçime mi ait? (Yeni hesap gelene kadar sepete eklemeyi beklet)
  const sonucGuncel = sonuc?.anahtar === JSON.stringify([secili, konsantrasyon, hacim]);

  return (
    <div className="atolye">
      <header className="atolye-ust">
        <div className="sayfa-genis">
          <span className="ust-baslik acik">Koku atölyesi</span>
          <h1>
            Kendi kokunu <em>yarat.</em>
          </h1>
          <p>
            Her katmandan en fazla üç esans seç. Seçtikçe hangi esansların uyumlu olduğunu, kokunun
            nasıl bir karakter kazandığını ve fiyatını anında gör.
          </p>
          <div className="tarifler">
            <span>Hazır tarifle başla:</span>
            {HAZIR_TARIFLER.map((t) => (
              <button key={t.ad} type="button" className="tarif-cip" onClick={() => tarifUygula(t)}>
                {t.ad}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="sayfa-genis atolye-duzeni">
        <section className="atolye-secim">
          {yuklemeHatasi && <p className="hata">{yuklemeHatasi}</p>}

          <div className="katman-sekmeleri" role="tablist">
            {KATMANLAR.map((k) => (
              <button
                key={k.ad}
                role="tab"
                aria-selected={aktifKatman === k.ad}
                className={aktifKatman === k.ad ? "katman-sekme secili" : "katman-sekme"}
                onClick={() => setAktifKatman(k.ad)}
              >
                <strong>{k.baslik}</strong>
                <span>
                  {katmandakiSayi(k.ad)}/{KATMAN_SINIRI}
                </span>
              </button>
            ))}
          </div>

          <p className="soluk katman-aciklama">
            {katmanBilgisi.aciklama}
            {secili.length > 0 && " Kartlardaki etiketler, mevcut seçiminle uyumu gösterir."}
          </p>

          <div className="esans-izgara">
            {gorunenEsanslar.map((e) => {
              const seciliMi = secili.includes(e.id);
              const dolu = !seciliMi && katmandakiSayi(e.katman) >= KATMAN_SINIRI;
              const etiket = seciliMi ? null : uyumEtiketi(sonuc?.adayPuanlari?.[e.id]);
              return (
                <button
                  key={e.id}
                  type="button"
                  className={`esans-karti${seciliMi ? " secili" : ""}`}
                  style={{ "--renk": e.renk, "--renk-acik": renkKaristir(e.renk, "#ffffff", 0.85) }}
                  onClick={() => degistir(e)}
                  disabled={dolu}
                  aria-pressed={seciliMi}
                  title={dolu ? "Bu katmanda en fazla 3 esans seçebilirsin" : e.aciklama}
                >
                  <span className="esans-ikon-kutu" aria-hidden="true">
                    <EsansIkonu ad={e.ad} renk={e.renk} boyut={46} />
                    {seciliMi && <span className="esans-tik">✓</span>}
                  </span>
                  <span className="esans-ad">{e.ad}</span>
                  <span className="esans-aile">{e.aile}</span>
                  <span className="esans-aciklama">{e.aciklama}</span>
                  {etiket && <span className={`uyum-etiket ${etiket.sinif}`}>{etiket.metin}</span>}
                  {e.ekFiyat >= 400 && <span className="degerli">Değerli esans</span>}
                </button>
              );
            })}
          </div>

          {seciliEsanslar.length > 0 && (
            <div className="secim-ozeti">
              <div className="secim-ozeti-ust">
                <h2>Tarifin</h2>
                <button className="link-buton" onClick={temizle}>
                  Hepsini kaldır
                </button>
              </div>
              {KATMANLAR.map((k) => {
                const liste = seciliEsanslar.filter((e) => e.katman === k.ad);
                return (
                  <div key={k.ad} className="secim-satir">
                    <span className="secim-katman">{k.baslik}</span>
                    <div className="cipler">
                      {liste.length === 0 && <span className="soluk kucuk">Henüz seçilmedi</span>}
                      {liste.map((e) => (
                        <button
                          key={e.id}
                          className="secim-cip"
                          style={{ "--renk": e.renk }}
                          onClick={() => degistir(e)}
                          aria-label={`${e.ad} esansını kaldır`}
                        >
                          <EsansIkonu ad={e.ad} renk={e.renk} boyut={20} />
                          {e.ad} <span aria-hidden="true">×</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <aside className="atolye-panel" id="atolye-panel">
          <div className="atolye-onizleme" style={{ "--ton": renkKaristir(sivirengi, "#ffffff", 0.8) }}>
            <SiseGorseli renk={sivirengi} tip={siseTipi} harf={parfumAdi.charAt(0).toLocaleUpperCase("tr")} />
          </div>

          <label className="atolye-ad">
            <span>Parfümünün adı</span>
            <input
              value={ad}
              onChange={(e) => setAd(e.target.value)}
              placeholder="Benim kokum"
              maxLength={40}
            />
          </label>

          <div className="uyum-kutusu" aria-live="polite">
            {sonuc ? (
              <>
                <div className="uyum-ust">
                  <span className="uyum-seviye" style={{ color: puanRengi(sonuc.puan) }}>
                    {sonuc.seviye}
                  </span>
                  {yeterliSecim && (
                    <span className="uyum-puan">
                      <strong>{sonuc.puan}</strong>/100
                    </span>
                  )}
                </div>
                {yeterliSecim && (
                  <div className="uyum-cubuk">
                    <span style={{ width: `${sonuc.puan}%`, background: puanRengi(sonuc.puan) }} />
                  </div>
                )}
                {sonuc.ozet && <p className="uyum-ozet">{sonuc.ozet}</p>}

                {sonuc.uyarilar.length > 0 && (
                  <ul className="uyarilar">
                    {sonuc.uyarilar.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                )}

                {sonuc.ciftler.length > 0 && (
                  <details className="cift-detay">
                    <summary>Esans çiftlerinin uyumu ({sonuc.ciftler.length})</summary>
                    <ul>
                      {sonuc.ciftler.map((c) => (
                        <li key={`${c.esansA}-${c.esansB}`}>
                          <span className={`cift-puan p${c.puan}`}>
                            {c.puan > 0 ? `+${c.puan}` : c.puan}
                          </span>
                          <span>
                            <strong>
                              {c.esansA} + {c.esansB}
                            </strong>
                            <small>{c.aciklama}</small>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </>
            ) : (
              <p className="soluk">
                Soldan bir esans seçerek başla. Uyum puanı ve öneriler burada görünecek.
              </p>
            )}
            {hata && <p className="hata">{hata}</p>}
          </div>

          <fieldset className="atolye-secenek">
            <legend>Konsantrasyon</legend>
            <div className="cipler">
              {KONSANTRASYONLAR.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={konsantrasyon === k ? "cip secili" : "cip"}
                  aria-pressed={konsantrasyon === k}
                  onClick={() => setKonsantrasyon(k)}
                >
                  {k}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="atolye-secenek">
            <legend>Hacim</legend>
            <div className="cipler">
              {HACIMLER.map((h) => (
                <button
                  key={h}
                  type="button"
                  className={hacim === h ? "cip secili" : "cip"}
                  aria-pressed={hacim === h}
                  onClick={() => setHacim(h)}
                >
                  {h} ml
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="sise-secici">
            <legend>Şişe biçimi</legend>
            {SISE_TIPLERI.map((tipAdi, i) => (
              <button
                type="button"
                key={tipAdi}
                className={siseTipi === i ? "sise-secenek secili" : "sise-secenek"}
                aria-pressed={siseTipi === i}
                onClick={() => setSiseTipi(i)}
                title={tipAdi}
              >
                <SiseGorseli renk={sivirengi} tip={i} harf="" />
                <span>{tipAdi}</span>
              </button>
            ))}
          </fieldset>

          <div className="atolye-fiyat">
            <span>Fiyat</span>
            <strong>{sonuc && yeterliSecim ? fiyatYaz(sonuc.fiyat) : "—"}</strong>
          </div>

          <button
            className="buton tam buyuk"
            disabled={!yeterliSecim || !sonucGuncel || hesaplaniyor}
            onClick={sepeteEkle}
          >
            {yeterliSecim ? "Sepete ekle" : "En az 2 esans seç"}
          </button>

          {eklendi && (
            <p className="sepet-bilgi" role="status">
              "{parfumAdi}" sepete eklendi. <Link to="/sepet">Sepete git →</Link>
            </p>
          )}
        </aside>
      </div>

      {/* Telefonda panel aşağıda kaldığı için puan ve fiyat altta sabit durur */}
      {secili.length > 0 && (
        <a href="#atolye-panel" className="mobil-ozet">
          <span className="mobil-ozet-renk" style={{ background: sivirengi }} aria-hidden="true" />
          <span>
            <strong style={{ color: sonuc && yeterliSecim ? puanRengi(sonuc.puan) : undefined }}>
              {sonuc ? sonuc.seviye : "Hesaplanıyor..."}
            </strong>
            <small>
              {secili.length} esans
              {sonuc && yeterliSecim && ` · ${sonuc.puan}/100 · ${fiyatYaz(sonuc.fiyat)}`}
            </small>
          </span>
          <span className="mobil-ozet-ok">Önizle ↓</span>
        </a>
      )}
    </div>
  );
}

export default KokuAtolyesi;
