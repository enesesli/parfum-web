import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { parfumleriGetir, markalariGetir } from "../api";
import ParfumKarti from "../components/ParfumKarti";
import FiltrePaneli from "../components/FiltrePaneli";

const ETIKETLER = {
  ara: (d) => `"${d}"`,
  markaId: null, // marka adıyla ayrıca yazılıyor
  cinsiyet: (d) => d,
  kokuAilesi: (d) => d,
  konsantrasyon: (d) => d,
  minFiyat: (d) => `En az ${d} ₺`,
  maxFiyat: (d) => `En çok ${d} ₺`,
  yeni: () => "Yeni gelenler",
  indirimli: () => "İndirimdekiler",
};

function sayfaBasligi(params, markalar) {
  if (params.get("yeni") === "true") return "Yeni gelenler";
  if (params.get("indirimli") === "true") return "İndirimdekiler";
  if (params.get("kokuAilesi")) return `${params.get("kokuAilesi")} kokular`;
  const marka = markalar.find((m) => String(m.id) === params.get("markaId"));
  if (marka) return marka.ad;
  return "Koleksiyon";
}

function ParfumListesi() {
  const [params, setParams] = useSearchParams();
  const [sonuc, setSonuc] = useState(null);
  const [markalar, setMarkalar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState("");
  const [filtreAcik, setFiltreAcik] = useState(false);
  const [aramaMetni, setAramaMetni] = useState(params.get("ara") ?? "");

  useEffect(() => {
    markalariGetir().then(setMarkalar).catch(() => {});
  }, []);

  useEffect(() => {
    setYukleniyor(true);
    setHata("");
    parfumleriGetir(params.toString())
      .then(setSonuc)
      .catch(() => setHata("Parfümler yüklenemedi. API çalışıyor mu?"))
      .finally(() => setYukleniyor(false));
  }, [params]);

  function degistir(ad, deger) {
    const yeni = new URLSearchParams(params);
    if (deger) yeni.set(ad, deger);
    else yeni.delete(ad);
    if (ad !== "sayfa") yeni.delete("sayfa"); // filtre değişince ilk sayfaya dön
    setParams(yeni);
  }

  function temizle() {
    setAramaMetni("");
    setParams({});
  }

  function aramaGonder(e) {
    e.preventDefault();
    degistir("ara", aramaMetni.trim());
  }

  const sayfa = Number(params.get("sayfa") || 1);

  // Seçili filtreleri çip olarak göstermek için
  const aktifFiltreler = [...params.entries()]
    .filter(([ad]) => ad in ETIKETLER)
    .map(([ad, deger]) => {
      if (ad === "markaId") {
        const marka = markalar.find((m) => String(m.id) === deger);
        return { ad, etiket: marka ? marka.ad : "Marka" };
      }
      return { ad, etiket: ETIKETLER[ad](deger) };
    });

  return (
    <div className="sayfa-genis">
      <header className="sayfa-ust">
        <span className="ust-baslik">Esans</span>
        <h1>{sayfaBasligi(params, markalar)}</h1>
        <p className="soluk">
          {sonuc ? `${sonuc.toplamKayit} parfüm` : " "}
          {yukleniyor && sonuc && " · güncelleniyor..."}
        </p>
      </header>

      <div className="liste-duzeni">
        <FiltrePaneli
          params={params}
          markalar={markalar}
          degistir={degistir}
          temizle={temizle}
          acik={filtreAcik}
          kapat={filtreAcik ? () => setFiltreAcik(false) : null}
        />

        <section>
          <div className="arac-cubugu">
            <form className="arama" onSubmit={aramaGonder} role="search">
              <input
                type="search"
                placeholder="Parfüm, marka veya nota ara (ör. vanilya)"
                value={aramaMetni}
                onChange={(e) => setAramaMetni(e.target.value)}
                aria-label="Ara"
              />
              <button type="submit" className="buton">
                Ara
              </button>
            </form>

            <button
              type="button"
              className="buton ikincil filtre-ac"
              onClick={() => setFiltreAcik(true)}
            >
              Filtreler{aktifFiltreler.length > 0 && ` (${aktifFiltreler.length})`}
            </button>

            <select
              className="siralama"
              value={params.get("sirala") ?? ""}
              onChange={(e) => degistir("sirala", e.target.value)}
              aria-label="Sırala"
            >
              <option value="">Önerilen</option>
              <option value="yeni">En yeniler</option>
              <option value="fiyat">Fiyat: düşükten yükseğe</option>
              <option value="fiyat_azalan">Fiyat: yüksekten düşüğe</option>
              <option value="ad">İsme göre (A-Z)</option>
            </select>
          </div>

          {aktifFiltreler.length > 0 && (
            <div className="aktif-filtreler">
              {aktifFiltreler.map((f) => (
                <button
                  key={f.ad}
                  className="aktif-cip"
                  onClick={() => {
                    if (f.ad === "ara") setAramaMetni("");
                    degistir(f.ad, "");
                  }}
                  aria-label={`${f.etiket} filtresini kaldır`}
                >
                  {f.etiket} <span aria-hidden="true">×</span>
                </button>
              ))}
              <button className="link-buton" onClick={temizle}>
                Tümünü temizle
              </button>
            </div>
          )}

          {hata && <p className="hata">{hata}</p>}

          {sonuc && sonuc.veriler.length === 0 && (
            <div className="bos-durum">
              <h2>Bu seçimlere uyan parfüm yok</h2>
              <p className="soluk">Birkaç filtreyi kaldırmayı ya da farklı bir nota aramayı dene.</p>
              <button className="buton" onClick={temizle}>
                Filtreleri temizle
              </button>
            </div>
          )}

          {sonuc && sonuc.veriler.length > 0 && (
            <div className="urun-izgara">
              {sonuc.veriler.map((p) => (
                <ParfumKarti key={p.id} parfum={p} />
              ))}
            </div>
          )}

          {sonuc && sonuc.toplamSayfa > 1 && (
            <nav className="sayfalama" aria-label="Sayfalar">
              <button
                className="sayfa-dugme"
                disabled={sayfa <= 1}
                onClick={() => degistir("sayfa", sayfa - 1)}
                aria-label="Önceki sayfa"
              >
                ←
              </button>
              {Array.from({ length: sonuc.toplamSayfa }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={n === sayfa ? "sayfa-dugme secili" : "sayfa-dugme"}
                  aria-current={n === sayfa ? "page" : undefined}
                  onClick={() => degistir("sayfa", n)}
                >
                  {n}
                </button>
              ))}
              <button
                className="sayfa-dugme"
                disabled={sayfa >= sonuc.toplamSayfa}
                onClick={() => degistir("sayfa", sayfa + 1)}
                aria-label="Sonraki sayfa"
              >
                →
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}

export default ParfumListesi;
