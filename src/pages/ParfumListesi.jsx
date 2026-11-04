import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { parfumleriGetir, markalariGetir } from "../api";
import ParfumKarti from "../components/ParfumKarti";
import FiltrePaneli from "../components/FiltrePaneli";

function ParfumListesi() {
  const [params, setParams] = useSearchParams();
  const [sonuc, setSonuc] = useState(null);
  const [markalar, setMarkalar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState("");

  // Markalar bir kere yüklenir
  useEffect(() => {
    markalariGetir()
      .then(setMarkalar)
      .catch(() => {});
  }, []);

  // Adresteki parametreler her değiştiğinde parfümler yeniden yüklenir
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
    if (ad !== "sayfa") yeni.delete("sayfa"); // filtre değişince 1. sayfaya dön
    setParams(yeni);
  }

  const sayfa = Number(params.get("sayfa") || 1);

  return (
    <div className="liste-duzeni">
      <FiltrePaneli
        params={params}
        markalar={markalar}
        degistir={degistir}
        temizle={() => setParams({})}
      />

      <section>
        {hata && <p className="hata">{hata}</p>}

        {sonuc && (
          <>
            <p className="sonuc-sayisi">
              {sonuc.toplamKayit} parfüm bulundu
              {yukleniyor && " · yükleniyor..."}
            </p>

            {sonuc.veriler.length === 0 ? (
              <p>Bu filtrelere uyan parfüm yok.</p>
            ) : (
              <div className="parfum-izgara">
                {sonuc.veriler.map((p) => (
                  <ParfumKarti key={p.id} parfum={p} />
                ))}
              </div>
            )}

            {sonuc.toplamSayfa > 1 && (
              <div className="sayfalama">
                <button
                  disabled={sayfa <= 1}
                  onClick={() => degistir("sayfa", sayfa - 1)}
                >
                  ← Önceki
                </button>
                <span>
                  Sayfa {sayfa} / {sonuc.toplamSayfa}
                </span>
                <button
                  disabled={sayfa >= sonuc.toplamSayfa}
                  onClick={() => degistir("sayfa", sayfa + 1)}
                >
                  Sonraki →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default ParfumListesi;
