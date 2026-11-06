import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  kartIleOde,
  kriptoFaturaOlustur,
  kriptoOdemesiniSimuleEt,
  siparisGetir,
  siparisOlustur,
} from "../api";
import { useSepet } from "../context/SepetContext";
import SiparisOzeti from "../components/SiparisOzeti";
import { eksikOzelKalemMi, fiyatYaz, kargoHesapla, siparisKalemi } from "../yardimci";

// Sahte ödeme servisinin kabul ettiği test kartları (API'deki listeyle aynı)
const TEST_KARTLARI = [
  { no: "4242 4242 4242 4242", sonuc: "Başarılı ödeme" },
  { no: "4000 0000 0000 0002", sonuc: "Kart reddedilir" },
  { no: "4000 0000 0000 9995", sonuc: "Limit yetersiz" },
];

const KRIPTO_PARALAR = [
  { kod: "USDT", ad: "Tether (USDT)" },
  { kod: "BTC", ad: "Bitcoin (BTC)" },
  { kod: "ETH", ad: "Ethereum (ETH)" },
];

const BOS_TESLIMAT = { adSoyad: "", eposta: "", telefon: "", adres: "", sehir: "" };
const BOS_KART = { kartSahibi: "", kartNo: "", sonKullanma: "", cvc: "" };

// "4242424242424242" -> "4242 4242 4242 4242"
function kartNoBicimle(deger) {
  return deger
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

// "1228" -> "12/28"
function sktBicimle(deger) {
  const rakam = deger.replace(/\D/g, "").slice(0, 4);
  return rakam.length > 2 ? `${rakam.slice(0, 2)}/${rakam.slice(2)}` : rakam;
}

function kalanSure(sonTarih, simdi) {
  const fark = Math.max(0, new Date(sonTarih).getTime() - simdi);
  const dk = Math.floor(fark / 60000);
  const sn = Math.floor((fark % 60000) / 1000);
  return { bitti: fark === 0, metin: `${String(dk).padStart(2, "0")}:${String(sn).padStart(2, "0")}` };
}

function Odeme() {
  const { urunler, toplamTutar, temizle } = useSepet();
  const navigate = useNavigate();

  const [adim, setAdim] = useState(1);
  const [teslimat, setTeslimat] = useState(BOS_TESLIMAT);
  const [siparis, setSiparis] = useState(null);

  const [yontem, setYontem] = useState("Kart");
  const [kart, setKart] = useState(BOS_KART);
  const [kriptoPara, setKriptoPara] = useState("USDT");

  const [isleniyor, setIsleniyor] = useState(false);
  const [hata, setHata] = useState("");
  const [simdi, setSimdi] = useState(() => Date.now());

  const fatura = siparis?.kripto ?? null;

  // Kripto faturasının geri sayımı
  useEffect(() => {
    if (!fatura) return;
    const zamanlayici = setInterval(() => setSimdi(Date.now()), 1000);
    return () => clearInterval(zamanlayici);
  }, [fatura]);

  // Gerçek bir kripto ödemesinde para cüzdandan gelir ve sunucu bunu blokzincirinden görür.
  // Ön yüz de birkaç saniyede bir siparişin durumunu sorar (polling).
  useEffect(() => {
    if (!fatura || !siparis || siparis.durum !== "Ödeme bekliyor") return;
    const zamanlayici = setInterval(() => {
      siparisGetir(siparis.siparisNo, siparis.eposta)
        .then((guncel) => {
          if (guncel.durum !== "Ödeme bekliyor") basarili(guncel);
        })
        .catch(() => {});
    }, 4000);
    return () => clearInterval(zamanlayici);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fatura, siparis?.durum]);

  // Ödeme başarılı olunca sepeti boşalt ve sipariş sayfasına geç
  function basarili(guncelSiparis) {
    temizle();
    navigate(
      `/siparis/${guncelSiparis.siparisNo}?eposta=${encodeURIComponent(guncelSiparis.eposta)}`,
      { replace: true, state: { yeniSiparis: true } },
    );
  }

  // Sepet boşsa ve henüz sipariş oluşturulmadıysa ödeme sayfasının anlamı yok
  if (urunler.length === 0 && !siparis) return <Navigate to="/sepet" replace />;

  const eksikVar = urunler.some(eksikOzelKalemMi);
  const tahminiKargo = kargoHesapla(toplamTutar);

  function teslimatDegistir(e) {
    const { name, value } = e.target;
    setTeslimat((onceki) => ({ ...onceki, [name]: value }));
  }

  function kartDegistir(e) {
    const { name, value } = e.target;
    let yeni = value;
    if (name === "kartNo") yeni = kartNoBicimle(value);
    if (name === "sonKullanma") yeni = sktBicimle(value);
    if (name === "cvc") yeni = value.replace(/\D/g, "").slice(0, 4);
    setKart((onceki) => ({ ...onceki, [name]: yeni }));
  }

  // 1. adım: siparişi oluştur. Fiyatları, stoğu ve kargoyu sunucu hesaplar.
  async function siparisiOlustur(e) {
    e.preventDefault();
    setHata("");
    setIsleniyor(true);
    try {
      const yeni = await siparisOlustur({ teslimat, kalemler: urunler.map(siparisKalemi) });
      setSiparis(yeni);
      setAdim(2);
    } catch (err) {
      setHata(err.message || "Sipariş oluşturulamadı.");
    } finally {
      setIsleniyor(false);
    }
  }

  async function kartlaOde(e) {
    e.preventDefault();
    setHata("");
    setIsleniyor(true);
    try {
      const guncel = await kartIleOde(siparis.siparisNo, { eposta: siparis.eposta, ...kart });
      basarili(guncel);
    } catch (err) {
      setHata(err.message || "Ödeme alınamadı.");
    } finally {
      setIsleniyor(false);
    }
  }

  async function kriptoFaturasiIste() {
    setHata("");
    setIsleniyor(true);
    try {
      const guncel = await kriptoFaturaOlustur(siparis.siparisNo, siparis.eposta, kriptoPara);
      setSiparis(guncel);
      setSimdi(Date.now());
    } catch (err) {
      setHata(err.message || "Fatura oluşturulamadı.");
    } finally {
      setIsleniyor(false);
    }
  }

  async function kriptoSimuleEt() {
    setHata("");
    setIsleniyor(true);
    try {
      const guncel = await kriptoOdemesiniSimuleEt(siparis.siparisNo, siparis.eposta);
      basarili(guncel);
    } catch (err) {
      setHata(err.message || "Ödeme onaylanamadı.");
    } finally {
      setIsleniyor(false);
    }
  }

  function kopyala(metin) {
    navigator.clipboard?.writeText(metin).catch(() => {});
  }

  const sure = fatura ? kalanSure(fatura.sonTarih, simdi) : null;

  // Özet: sipariş oluşmadan önce sepetten tahmini, sonra sunucunun hesapladığı kesin tutarlar
  const ozet = siparis
    ? {
        kalemler: siparis.kalemler,
        araToplam: siparis.araToplam,
        kargo: siparis.kargoUcreti,
        toplam: siparis.toplam,
        not: `Sipariş no: ${siparis.siparisNo}`,
      }
    : {
        kalemler: urunler.map((u) => ({
          ad: u.ad,
          marka: u.marka,
          adet: u.adet,
          tutar: u.fiyat * u.adet,
        })),
        araToplam: toplamTutar,
        kargo: tahminiKargo,
        toplam: toplamTutar + tahminiKargo,
        not: "Kesin tutar, sipariş oluşturulurken sunucuda hesaplanır.",
      };

  return (
    <div className="sayfa-genis">
      <header className="sayfa-ust">
        <span className="ust-baslik">Güvenli ödeme · Simülasyon</span>
        <h1>Siparişi tamamla</h1>
        <ol className="adimlar">
          <li className={adim === 1 ? "aktif" : "tamam"}>
            <span>1</span> Teslimat bilgileri
          </li>
          <li className={adim === 2 ? "aktif" : ""}>
            <span>2</span> Ödeme
          </li>
        </ol>
      </header>

      <div className="sepet-duzeni">
        <section className="odeme-alani">
          {adim === 1 && (
            <form className="odeme-formu" onSubmit={siparisiOlustur}>
              <h2>Teslimat bilgileri</h2>
              <div className="form-izgara">
                <label>
                  Ad soyad
                  <input name="adSoyad" value={teslimat.adSoyad} onChange={teslimatDegistir} required maxLength={100} autoComplete="name" />
                </label>
                <label>
                  Telefon
                  <input name="telefon" type="tel" value={teslimat.telefon} onChange={teslimatDegistir} required placeholder="05xx xxx xx xx" autoComplete="tel" />
                </label>
                <label className="genis">
                  E-posta
                  <input name="eposta" type="email" value={teslimat.eposta} onChange={teslimatDegistir} required autoComplete="email" />
                  <small>Siparişini bu adres ve sipariş numarasıyla takip edeceksin.</small>
                </label>
                <label className="genis">
                  Adres
                  <textarea name="adres" rows="3" value={teslimat.adres} onChange={teslimatDegistir} required minLength={10} maxLength={300} autoComplete="street-address" />
                </label>
                <label>
                  Şehir
                  <input name="sehir" value={teslimat.sehir} onChange={teslimatDegistir} required maxLength={50} autoComplete="address-level1" />
                </label>
              </div>

              {eksikVar && (
                <p className="hata">
                  Sepetindeki bir özel parfümün tarifi eksik. <Link to="/sepet">Sepete dönüp</Link> kaldır ve
                  atölyeden yeniden ekle.
                </p>
              )}
              {hata && <p className="hata">{hata}</p>}

              <button type="submit" className="buton tam buyuk" disabled={isleniyor || eksikVar}>
                {isleniyor ? "Sipariş oluşturuluyor..." : "Ödemeye geç"}
              </button>
            </form>
          )}

          {adim === 2 && siparis && (
            <div className="odeme-formu">
              <div className="teslimat-ozet">
                <div>
                  <h2>Teslimat</h2>
                  <p>
                    {siparis.adSoyad} · {siparis.telefon}
                    <br />
                    {siparis.adres}, {siparis.sehir}
                  </p>
                </div>
              </div>

              <h2>Ödeme yöntemi</h2>
              <div className="yontem-secici" role="tablist">
                {[
                  { kod: "Kart", baslik: "Kredi / banka kartı", alt: "Test kartlarıyla" },
                  { kod: "Kripto", baslik: "Kripto para", alt: "Simülasyon" },
                ].map((y) => (
                  <button
                    key={y.kod}
                    type="button"
                    role="tab"
                    aria-selected={yontem === y.kod}
                    className={yontem === y.kod ? "yontem secili" : "yontem"}
                    onClick={() => {
                      setYontem(y.kod);
                      setHata("");
                    }}
                    disabled={Boolean(fatura) && y.kod === "Kart" && isleniyor}
                  >
                    <strong>{y.baslik}</strong>
                    <small>{y.alt}</small>
                  </button>
                ))}
              </div>

              {yontem === "Kart" && (
                <form onSubmit={kartlaOde} className="kart-formu">
                  <div className="bilgi-kutusu">
                    <strong>Bu bir simülasyondur, gerçek kart bilgisi girme.</strong>
                    <p>Sadece aşağıdaki test kartları kabul edilir. Son kullanma tarihi ileri bir tarih, CVC herhangi 3 hane olabilir.</p>
                    <div className="test-kartlari">
                      {TEST_KARTLARI.map((t) => (
                        <button
                          type="button"
                          key={t.no}
                          className="test-karti"
                          onClick={() =>
                            setKart({ kartSahibi: siparis.adSoyad, kartNo: t.no, sonKullanma: "12/30", cvc: "123" })
                          }
                        >
                          <code>{t.no}</code>
                          <small>{t.sonuc}</small>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-izgara">
                    <label className="genis">
                      Kart üzerindeki isim
                      <input name="kartSahibi" value={kart.kartSahibi} onChange={kartDegistir} required autoComplete="off" />
                    </label>
                    <label className="genis">
                      Kart numarası
                      <input name="kartNo" value={kart.kartNo} onChange={kartDegistir} required inputMode="numeric" placeholder="4242 4242 4242 4242" autoComplete="off" />
                    </label>
                    <label>
                      Son kullanma (AA/YY)
                      <input name="sonKullanma" value={kart.sonKullanma} onChange={kartDegistir} required inputMode="numeric" placeholder="12/30" autoComplete="off" />
                    </label>
                    <label>
                      CVC
                      <input name="cvc" value={kart.cvc} onChange={kartDegistir} required inputMode="numeric" placeholder="123" autoComplete="off" />
                    </label>
                  </div>

                  {hata && <p className="hata">{hata}</p>}

                  <button type="submit" className="buton tam buyuk" disabled={isleniyor}>
                    {isleniyor ? "Ödeme işleniyor..." : `${fiyatYaz(siparis.toplam)} öde`}
                  </button>
                </form>
              )}

              {yontem === "Kripto" && (
                <div className="kripto-alani">
                  <div className="bilgi-kutusu uyari">
                    <strong>Yalnızca simülasyon</strong>
                    <p>
                      Türkiye'de kripto varlıklarla ödeme 2021'den beri yasaktır. Bu bölüm, kripto ödemenin nasıl
                      çalıştığını göstermek için hazırlanmış bir simülasyondur: gerçek bir cüzdan, borsa ya da
                      blokzinciri kullanılmaz. Gösterilen adrese hiçbir şey gönderme.
                    </p>
                  </div>

                  {!fatura || sure.bitti ? (
                    <>
                      <div className="cipler">
                        {KRIPTO_PARALAR.map((p) => (
                          <button
                            key={p.kod}
                            type="button"
                            className={kriptoPara === p.kod ? "cip secili" : "cip"}
                            aria-pressed={kriptoPara === p.kod}
                            onClick={() => setKriptoPara(p.kod)}
                          >
                            {p.ad}
                          </button>
                        ))}
                      </div>
                      {fatura && sure.bitti && <p className="hata">Önceki faturanın süresi doldu. Yeni bir fatura oluştur.</p>}
                      {hata && <p className="hata">{hata}</p>}
                      <button className="buton tam buyuk" onClick={kriptoFaturasiIste} disabled={isleniyor}>
                        {isleniyor ? "Fatura hazırlanıyor..." : "Ödeme faturası oluştur"}
                      </button>
                    </>
                  ) : (
                    <div className="kripto-fatura">
                      <div className="fatura-ust">
                        <span className="simulasyon-rozet">Simülasyon</span>
                        <span className={sure.metin < "03:00" ? "geri-sayim azaldi" : "geri-sayim"}>
                          {sure.metin}
                        </span>
                      </div>
                      <p className="soluk kucuk">Gönderilecek tutar</p>
                      <div className="fatura-tutar">
                        <strong>
                          {fatura.tutar} {fatura.para}
                        </strong>
                        <button type="button" className="link-buton" onClick={() => kopyala(String(fatura.tutar))}>
                          Kopyala
                        </button>
                      </div>
                      <p className="soluk kucuk">
                        {fiyatYaz(siparis.toplam)} · temsili kur 1 {fatura.para} ≈ {fiyatYaz(fatura.kur)}. Kur, fatura anında
                        sabitlendi.
                      </p>
                      <p className="soluk kucuk">Adres (demo, hiçbir ağda geçerli değil)</p>
                      <div className="fatura-adres">
                        <code>{fatura.adres}</code>
                        <button type="button" className="link-buton" onClick={() => kopyala(fatura.adres)}>
                          Kopyala
                        </button>
                      </div>
                      <div className="bekleniyor">
                        <span className="nabiz" aria-hidden="true" />
                        Ödeme bekleniyor. Gerçek bir sistemde sunucu blokzincirini izler, bu sayfa da birkaç saniyede bir
                        durumu kontrol eder.
                      </div>
                      {hata && <p className="hata">{hata}</p>}
                      <button className="buton tam buyuk" onClick={kriptoSimuleEt} disabled={isleniyor}>
                        {isleniyor ? "Onaylanıyor..." : "Ödeme gönderilmiş gibi simüle et"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        <SiparisOzeti {...ozet} />
      </div>
    </div>
  );
}

export default Odeme;
