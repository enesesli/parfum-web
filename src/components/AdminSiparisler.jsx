import { Fragment, useEffect, useState } from "react";
import { siparisDurumGuncelle, siparisleriGetir } from "../api";
import { fiyatYaz, tarihYaz } from "../yardimci";

const DURUMLAR = ["Ödeme bekliyor", "Ödendi", "Hazırlanıyor", "Kargoda", "Teslim edildi", "İptal edildi"];

function durumSinifi(durum) {
  return {
    "Ödeme bekliyor": "bekliyor",
    "Ödendi": "odendi",
    "Hazırlanıyor": "hazirlaniyor",
    "Kargoda": "kargoda",
    "Teslim edildi": "teslim",
    "İptal edildi": "iptal",
  }[durum];
}

function AdminSiparisler({ token, yetkiHatasiMi }) {
  const [sonuc, setSonuc] = useState(null);
  const [sayfa, setSayfa] = useState(1);
  const [durumFiltresi, setDurumFiltresi] = useState("");
  const [acik, setAcik] = useState(null);
  const [yenile, setYenile] = useState(0);
  const [hata, setHata] = useState("");
  const [mesaj, setMesaj] = useState("");

  useEffect(() => {
    const sorgu = new URLSearchParams({ sayfa, boyut: 15 });
    if (durumFiltresi) sorgu.set("durum", durumFiltresi);
    siparisleriGetir(sorgu.toString(), token)
      .then(setSonuc)
      .catch((err) => {
        if (!yetkiHatasiMi(err)) setHata("Siparişler yüklenemedi.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sayfa, durumFiltresi, yenile, token]);

  async function durumDegistir(siparis, yeniDurum) {
    const uyari =
      yeniDurum === "İptal edildi"
        ? `${siparis.siparisNo} iptal edilsin mi?${
            siparis.durum !== "Ödeme bekliyor" ? " Ürünler stoğa geri eklenecek." : ""
          }`
        : null;
    if (uyari && !window.confirm(uyari)) return;

    setHata("");
    try {
      await siparisDurumGuncelle(siparis.id, yeniDurum, token);
      setMesaj(`${siparis.siparisNo}: ${yeniDurum}`);
      setYenile((n) => n + 1);
    } catch (err) {
      if (!yetkiHatasiMi(err)) setHata(err.message);
    }
  }

  return (
    <div>
      <div className="admin-filtre">
        <div className="cipler">
          {["", ...DURUMLAR].map((d) => (
            <button
              key={d || "tumu"}
              className={durumFiltresi === d ? "cip secili" : "cip"}
              onClick={() => {
                setDurumFiltresi(d);
                setSayfa(1);
              }}
            >
              {d || "Tümü"}
            </button>
          ))}
        </div>
      </div>

      {mesaj && <p className="basari">{mesaj}</p>}
      {hata && <p className="hata">{hata}</p>}

      {sonuc && sonuc.veriler.length === 0 && <p className="soluk">Bu filtrede sipariş yok.</p>}

      {sonuc && sonuc.veriler.length > 0 && (
        <div className="tablo-kap">
          <table className="admin-tablo">
            <thead>
              <tr>
                <th>Sipariş</th>
                <th>Müşteri</th>
                <th className="sag">Toplam</th>
                <th>Ödeme</th>
                <th>Durum</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sonuc.veriler.map((s) => (
                <Fragment key={s.id}>
                  <tr className={acik === s.id ? "secili" : ""}>
                    <td>
                      <button className="link-buton tablo-no" onClick={() => setAcik(acik === s.id ? null : s.id)}>
                        {s.siparisNo}
                      </button>
                      <small className="tablo-alt">{tarihYaz(s.olusturmaTarihi)}</small>
                    </td>
                    <td>
                      {s.adSoyad}
                      <small className="tablo-alt">{s.sehir}</small>
                    </td>
                    <td className="sag">
                      {fiyatYaz(s.toplam)}
                      <small className="tablo-alt">{s.kalemler.reduce((t, k) => t + k.adet, 0)} ürün</small>
                    </td>
                    <td>{s.odemeYontemi && s.odemeTarihi ? s.odemeYontemi : "—"}</td>
                    <td>
                      <span className={`durum-rozet ${durumSinifi(s.durum)}`}>{s.durum}</span>
                    </td>
                    <td>
                      <div className="islemler">
                        {s.sonrakiDurumlar.map((d) => (
                          <button
                            key={d}
                            className={d === "İptal edildi" ? "buton tehlike kucuk" : "buton ikincil kucuk"}
                            onClick={() => durumDegistir(s, d)}
                          >
                            {d === "İptal edildi" ? "İptal et" : `→ ${d}`}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                  {acik === s.id && (
                    <tr className="detay-satiri">
                      <td colSpan={6}>
                        <div className="siparis-acilim">
                          <div>
                            <strong>Teslimat</strong>
                            <p>
                              {s.adSoyad} · {s.telefon} · {s.eposta}
                              <br />
                              {s.adres}, {s.sehir}
                            </p>
                          </div>
                          <div>
                            <strong>Ürünler</strong>
                            <ul>
                              {s.kalemler.map((k, i) => (
                                <li key={i}>
                                  {k.adet} × {k.marka} {k.ad} <span className="soluk">({k.aciklama})</span> —{" "}
                                  {fiyatYaz(k.tutar)}
                                </li>
                              ))}
                            </ul>
                            <p className="soluk">
                              Ara toplam {fiyatYaz(s.araToplam)} · Kargo {fiyatYaz(s.kargoUcreti)}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sonuc && sonuc.toplamSayfa > 1 && (
        <div className="sayfalama">
          <button className="sayfa-dugme" disabled={sayfa <= 1} onClick={() => setSayfa(sayfa - 1)}>
            ←
          </button>
          <span>
            Sayfa {sayfa} / {sonuc.toplamSayfa}
          </span>
          <button className="sayfa-dugme" disabled={sayfa >= sonuc.toplamSayfa} onClick={() => setSayfa(sayfa + 1)}>
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminSiparisler;
