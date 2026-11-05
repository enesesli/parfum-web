import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  markalariGetir,
  parfumEkle,
  parfumGuncelle,
  parfumleriGetir,
  parfumSil,
} from "../api";
import { useAuth } from "../context/AuthContext";
import { fiyatYaz } from "../components/ParfumKarti";
import ParfumFormu from "../components/ParfumFormu";

const SAYFA_BOYUTU = 10;

function Admin() {
  const { token, kullaniciAdi, cikis } = useAuth();

  const [sayfa, setSayfa] = useState(1);
  const [sonuc, setSonuc] = useState(null);
  const [markalar, setMarkalar] = useState([]);
  const [yenile, setYenile] = useState(0);
  const [hata, setHata] = useState("");
  const [mesaj, setMesaj] = useState("");

  // null: form kapalı, "yeni": ekleme formu, parfüm nesnesi: düzenleme formu
  const [duzenlenen, setDuzenlenen] = useState(null);

  useEffect(() => {
    markalariGetir().then(setMarkalar).catch(() => {});
  }, []);

  useEffect(() => {
    parfumleriGetir(`sayfa=${sayfa}&boyut=${SAYFA_BOYUTU}`)
      .then(setSonuc)
      .catch(() => setHata("Parfümler yüklenemedi. API çalışıyor mu?"));
  }, [sayfa, yenile]);

  // Token süresi dolduysa (401) ya da yetki yoksa (403) oturumu kapat.
  // KorumaliRoute bunu görüp giriş sayfasına yönlendirir.
  function yetkiHatasiMi(err) {
    if (err.durum !== 401 && err.durum !== 403) return false;
    cikis("Oturumun sona erdi, lütfen tekrar giriş yap.");
    return true;
  }

  async function kaydet(veri) {
    try {
      if (duzenlenen === "yeni") {
        const yeni = await parfumEkle(veri, token);
        setMesaj(`"${yeni.ad}" eklendi.`);
      } else {
        await parfumGuncelle(duzenlenen.id, veri, token);
        setMesaj(`"${veri.ad}" güncellendi.`);
      }
      setDuzenlenen(null);
      setYenile((n) => n + 1);
    } catch (err) {
      if (yetkiHatasiMi(err)) return;
      throw err; // Form hata mesajını kendisi gösterecek
    }
  }

  async function sil(parfum) {
    if (!window.confirm(`"${parfum.ad}" silinsin mi? Bu işlem geri alınamaz.`)) return;

    setHata("");
    try {
      await parfumSil(parfum.id, token);
      setMesaj(`"${parfum.ad}" silindi.`);
      if (duzenlenen?.id === parfum.id) setDuzenlenen(null);

      // Sayfadaki son kayıt silindiyse bir önceki sayfaya dön
      if (sonuc.veriler.length === 1 && sayfa > 1) setSayfa(sayfa - 1);
      else setYenile((n) => n + 1);
    } catch (err) {
      if (yetkiHatasiMi(err)) return;
      setHata(err.message);
    }
  }

  function formuAc(hedef) {
    setMesaj("");
    setDuzenlenen(hedef);
  }

  return (
    <div className="admin">
      <div className="admin-ust">
        <div>
          <h1>Yönetim paneli</h1>
          <p className="soluk">Giriş yapan: {kullaniciAdi}</p>
        </div>
        <button onClick={() => formuAc("yeni")} disabled={duzenlenen === "yeni"}>
          + Yeni parfüm
        </button>
      </div>

      {mesaj && <p className="basari">{mesaj}</p>}
      {hata && <p className="hata">{hata}</p>}

      {duzenlenen && (
        <ParfumFormu
          key={duzenlenen === "yeni" ? "yeni" : duzenlenen.id}
          baslangic={duzenlenen === "yeni" ? null : duzenlenen}
          markalar={markalar}
          onKaydet={kaydet}
          onIptal={() => setDuzenlenen(null)}
        />
      )}

      {sonuc && (
        <>
          <div className="tablo-kap">
            <table className="admin-tablo">
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>Marka</th>
                  <th>Cinsiyet</th>
                  <th className="sag">Fiyat</th>
                  <th className="sag">Stok</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sonuc.veriler.map((p) => (
                  <tr key={p.id} className={duzenlenen?.id === p.id ? "secili" : ""}>
                    <td>
                      <Link to={`/parfum/${p.id}`}>{p.ad}</Link>
                    </td>
                    <td>{p.marka}</td>
                    <td>{p.cinsiyet}</td>
                    <td className="sag">{fiyatYaz(p.fiyat)}</td>
                    <td className={p.stok === 0 ? "sag tukendi" : "sag"}>{p.stok}</td>
                    <td>
                      <div className="islemler">
                        <button className="ikincil-buton" onClick={() => formuAc(p)}>
                          Düzenle
                        </button>
                        <button className="tehlike-buton" onClick={() => sil(p)}>
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sonuc.toplamSayfa > 1 && (
            <div className="sayfalama">
              <button disabled={sayfa <= 1} onClick={() => setSayfa(sayfa - 1)}>
                ← Önceki
              </button>
              <span>
                Sayfa {sayfa} / {sonuc.toplamSayfa}
              </span>
              <button
                disabled={sayfa >= sonuc.toplamSayfa}
                onClick={() => setSayfa(sayfa + 1)}
              >
                Sonraki →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Admin;
