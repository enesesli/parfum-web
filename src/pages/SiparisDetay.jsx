import { useEffect, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import { siparisGetir } from "../api";
import SiparisOzeti from "../components/SiparisOzeti";
import { tarihYaz } from "../yardimci";

const ADIMLAR = ["Ödeme bekliyor", "Ödendi", "Hazırlanıyor", "Kargoda", "Teslim edildi"];

function SiparisDetay() {
  const { siparisNo } = useParams();
  const [params] = useSearchParams();
  const eposta = params.get("eposta") ?? "";
  const { state } = useLocation();

  const [siparis, setSiparis] = useState(null);
  const [hata, setHata] = useState("");

  useEffect(() => {
    setHata("");
    siparisGetir(siparisNo, eposta)
      .then(setSiparis)
      .catch((e) =>
        setHata(e.durum === 404 ? "Bu numara ve e-postayla eşleşen bir sipariş bulunamadı." : "Sipariş yüklenemedi."),
      );
  }, [siparisNo, eposta]);

  if (hata) {
    return (
      <div className="sayfa-genis bos-durum">
        <h1>{hata}</h1>
        <Link to="/siparis-sorgula" className="buton">
          Tekrar dene
        </Link>
      </div>
    );
  }

  if (!siparis) return <div className="sayfa-genis yukleniyor">Yükleniyor...</div>;

  const iptal = siparis.durum === "İptal edildi";
  const aktifSira = ADIMLAR.indexOf(siparis.durum);

  return (
    <div className="sayfa-genis">
      {state?.yeniSiparis && (
        <div className="basari-bandi" role="status">
          <span className="basari-ikon" aria-hidden="true">✓</span>
          <div>
            <strong>Teşekkürler, siparişin alındı!</strong>
            <p>
              Sipariş numaran <code>{siparis.siparisNo}</code>. Bu numara ve e-postanla siparişini dilediğin zaman
              takip edebilirsin.
            </p>
          </div>
        </div>
      )}

      <header className="sayfa-ust">
        <span className="ust-baslik">Sipariş {siparis.siparisNo}</span>
        <h1>{iptal ? "Sipariş iptal edildi" : siparis.durum}</h1>
        <p className="soluk">{tarihYaz(siparis.olusturmaTarihi)} tarihinde oluşturuldu</p>
      </header>

      <div className="sepet-duzeni">
        <section>
          {!iptal && (
            <ol className="durum-cizelgesi">
              {ADIMLAR.map((a, i) => (
                <li key={a} className={i < aktifSira ? "gecti" : i === aktifSira ? "simdi" : ""}>
                  <span className="durum-nokta" aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ol>
          )}

          <div className="bilgi-izgara">
            <div className="bilgi-kart">
              <h2>Teslimat</h2>
              <p>
                {siparis.adSoyad}
                <br />
                {siparis.telefon}
                <br />
                {siparis.adres}, {siparis.sehir}
              </p>
            </div>
            <div className="bilgi-kart">
              <h2>Ödeme</h2>
              {siparis.odemeTarihi ? (
                <p>
                  {siparis.odemeYontemi === "Kart"
                    ? `Kart ile ödendi (**** ${siparis.kartSonDortHane})`
                    : `Kripto ile ödendi (${siparis.kripto?.tutar} ${siparis.kripto?.para}, simülasyon)`}
                  <br />
                  <span className="soluk">{tarihYaz(siparis.odemeTarihi)}</span>
                </p>
              ) : (
                <p className="soluk">Henüz ödeme alınmadı.</p>
              )}
            </div>
          </div>
        </section>

        <SiparisOzeti
          baslik="Ürünler"
          kalemler={siparis.kalemler}
          araToplam={siparis.araToplam}
          kargo={siparis.kargoUcreti}
          toplam={siparis.toplam}
        />
      </div>
    </div>
  );
}

export default SiparisDetay;
