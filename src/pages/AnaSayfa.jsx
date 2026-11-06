import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { markalariGetir, parfumleriGetir } from "../api";
import ParfumKarti from "../components/ParfumKarti";
import SiseGorseli from "../components/SiseGorseli";
import { KOKU_AILELERI, renkKaristir } from "../yardimci";

function UrunSeridi({ baslik, aciklama, sorgu, tumuLink }) {
  const [urunler, setUrunler] = useState(null);

  useEffect(() => {
    parfumleriGetir(sorgu)
      .then((s) => setUrunler(s.veriler))
      .catch(() => setUrunler([]));
  }, [sorgu]);

  if (urunler && urunler.length === 0) return null;

  return (
    <section className="bolum">
      <div className="bolum-ust">
        <div>
          <h2>{baslik}</h2>
          <p className="soluk">{aciklama}</p>
        </div>
        <Link to={tumuLink} className="ok-link">
          Tümünü gör →
        </Link>
      </div>
      <div className="urun-izgara dortlu">
        {urunler
          ? urunler.map((p) => <ParfumKarti key={p.id} parfum={p} />)
          : Array.from({ length: 4 }, (_, i) => <div key={i} className="iskelet" />)}
      </div>
    </section>
  );
}

function AnaSayfa() {
  const [markalar, setMarkalar] = useState([]);

  useEffect(() => {
    markalariGetir().then(setMarkalar).catch(() => {});
  }, []);

  return (
    <>
      <section className="kahraman">
        <div className="kahraman-ic">
          <div className="kahraman-metin">
            <span className="ust-baslik acik">Sonbahar · Kış koleksiyonu</span>
            <h1>
              Kokunuz,
              <br />
              <em>imzanız.</em>
            </h1>
            <p>
              Dünyanın en sevilen parfüm evlerinden seçilmiş kokular. Notalarını keşfedin, size en yakın
              olanı bulun.
            </p>
            <div className="kahraman-butonlar">
              <Link to="/parfumler" className="buton acik">
                Koleksiyonu keşfet
              </Link>
              <Link to="/parfumler?yeni=true" className="buton cizgili">
                Yeni gelenler
              </Link>
            </div>
          </div>

          <div className="kahraman-gorsel" aria-hidden="true">
            <div className="hale" />
            <SiseGorseli className="kahraman-sise sol" renk="#d45f77" tip={1} harf="E" />
            <SiseGorseli className="kahraman-sise orta" renk="#e3b766" tip={3} harf="E" />
            <SiseGorseli className="kahraman-sise sag" renk="#2f5d50" tip={2} harf="E" />
          </div>
        </div>
      </section>

      <div className="sayfa-genis">
        <section className="bolum">
          <div className="bolum-ust">
            <div>
              <h2>Koku ailelerine göre keşfet</h2>
              <p className="soluk">Hangi notaları sevdiğini biliyorsan, oradan başla.</p>
            </div>
          </div>
          <div className="aile-izgara">
            {KOKU_AILELERI.map((k) => (
              <Link
                key={k.ad}
                to={`/parfumler?kokuAilesi=${encodeURIComponent(k.ad)}`}
                className="aile-karti"
                style={{
                  "--aile": k.renk,
                  "--aile-acik": renkKaristir(k.renk, "#ffffff", 0.78),
                }}
              >
                <span className="aile-damla" aria-hidden="true" />
                <strong>{k.ad}</strong>
                <span>{k.aciklama}</span>
              </Link>
            ))}
          </div>
        </section>

        <UrunSeridi
          baslik="Yeni gelenler"
          aciklama="Koleksiyona en son katılan kokular."
          sorgu="yeni=true&sirala=yeni&boyut=4"
          tumuLink="/parfumler?yeni=true"
        />

        <section className="bolum atolye-tanitim">
          <div className="atolye-tanitim-metin">
            <span className="ust-baslik acik">Koku atölyesi</span>
            <h2>
              Kendi kokunu <em>yarat.</em>
            </h2>
            <p>
              Otuz esanstan üst, kalp ve alt notalarını seç. Hangi notanın hangisiyle uyumlu olduğunu
              anında gösterelim; şişesini de sen tasarla.
            </p>
            <Link to="/kendi-kokun" className="buton acik">
              Atölyeye git
            </Link>
          </div>
          <div className="atolye-tanitim-gorsel" aria-hidden="true">
            {["#e9d36b", "#d9667e", "#9b8ac4", "#c8894a", "#7d8a64"].map((r, i) => (
              <span key={r} className="esans-damla" style={{ "--renk": r, "--i": i }} />
            ))}
            <SiseGorseli className="atolye-tanitim-sise" renk="#c98a6a" tip={1} harf="E" />
          </div>
        </section>

        <section className="bolum rehber">
          <div className="rehber-metin">
            <span className="ust-baslik">Rehber</span>
            <h2>Bir parfüm nasıl okunur?</h2>
            <p>
              Her parfüm zamanla açılan üç katmandan oluşur. Ürün sayfalarındaki nota piramidi, bir
              kokunun tenindeki yolculuğunu gösterir.
            </p>
          </div>
          <ol className="piramit-anlatim">
            <li>
              <strong>Üst notalar</strong>
              <span>İlk 15 dakika</span>
              <p>İlk izlenim. Narenciye, meyve ve baharat gibi uçucu notalar.</p>
            </li>
            <li>
              <strong>Kalp notaları</strong>
              <span>2 - 4 saat</span>
              <p>Kokunun karakteri. Çiçekler, çay ve aromatik otlar burada.</p>
            </li>
            <li>
              <strong>Alt notalar</strong>
              <span>Saatlerce</span>
              <p>Tende kalan iz. Odunlar, amber, misk ve vanilya.</p>
            </li>
          </ol>
        </section>

        <UrunSeridi
          baslik="İndirimdekiler"
          aciklama="Sınırlı süre için özel fiyatlı kokular."
          sorgu="indirimli=true&boyut=4"
          tumuLink="/parfumler?indirimli=true"
        />

        {markalar.length > 0 && (
          <section className="bolum">
            <div className="bolum-ust">
              <div>
                <h2>Parfüm evleri</h2>
                <p className="soluk">Koleksiyondaki markalara göz at.</p>
              </div>
            </div>
            <div className="marka-izgara">
              {markalar.map((m) => (
                <Link key={m.id} to={`/parfumler?markaId=${m.id}`} className="marka-karti">
                  <strong>{m.ad}</strong>
                  <span>
                    {m.ulke} · {m.parfumSayisi} koku
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default AnaSayfa;
