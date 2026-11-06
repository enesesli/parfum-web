import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { parfumGetir, parfumleriGetir } from "../api";
import { useSepet } from "../context/SepetContext";
import ParfumGorseli from "../components/ParfumGorseli";
import ParfumKarti from "../components/ParfumKarti";
import EsansIkonu from "../components/EsansIkonu";
import { fiyatYaz, indirimOrani, notalariAyir, renkKaristir } from "../yardimci";

const KATMANLAR = [
  { alan: "ustNotalar", ad: "Üst notalar", sure: "İlk izlenim" },
  { alan: "kalpNotalar", ad: "Kalp notaları", sure: "Karakter" },
  { alan: "altNotalar", ad: "Alt notalar", sure: "Kalıcı iz" },
];

function ParfumDetay() {
  const { id } = useParams();
  const { ekle, urunler } = useSepet();
  const [parfum, setParfum] = useState(null);
  const [benzerler, setBenzerler] = useState([]);
  const [hata, setHata] = useState("");
  const [eklendi, setEklendi] = useState(false);

  useEffect(() => {
    setParfum(null);
    setHata("");
    setEklendi(false);
    parfumGetir(id)
      .then(setParfum)
      .catch((e) =>
        setHata(e.durum === 404 ? "Bu parfüm bulunamadı." : "Parfüm yüklenemedi."),
      );
  }, [id]);

  // Aynı koku ailesinden başka parfümler
  useEffect(() => {
    if (!parfum) return;
    const sorgu = `kokuAilesi=${encodeURIComponent(parfum.kokuAilesi)}&boyut=5`;
    parfumleriGetir(sorgu)
      .then((s) => setBenzerler(s.veriler.filter((p) => p.id !== parfum.id).slice(0, 4)))
      .catch(() => setBenzerler([]));
  }, [parfum]);

  if (hata) {
    return (
      <div className="sayfa-genis bos-durum">
        <h1>{hata}</h1>
        <Link to="/parfumler" className="buton">
          Koleksiyona dön
        </Link>
      </div>
    );
  }

  if (!parfum) return <div className="sayfa-genis yukleniyor">Yükleniyor...</div>;

  const sepettekiAdet = urunler.find((u) => u.id === parfum.id)?.adet ?? 0;
  const tukendi = parfum.stok === 0;
  const stokDoldu = sepettekiAdet >= parfum.stok;
  const indirim = indirimOrani(parfum);

  function sepeteEkle() {
    ekle(parfum);
    setEklendi(true);
  }

  return (
    <div className="sayfa-genis">
      <nav className="kirinti" aria-label="Konum">
        <Link to="/">Ana sayfa</Link>
        <span>/</span>
        <Link to="/parfumler">Koleksiyon</Link>
        <span>/</span>
        <Link to={`/parfumler?markaId=${parfum.markaId}`}>{parfum.marka}</Link>
      </nav>

      <article className="detay">
        <div
          className="detay-gorsel"
          style={{
            "--ton": renkKaristir(parfum.renk, "#ffffff", 0.8),
            "--ton-koyu": renkKaristir(parfum.renk, "#ffffff", 0.55),
          }}
        >
          <ParfumGorseli parfum={parfum} />
          <div className="rozetler">
            {parfum.yeni && <span className="rozet-yeni">Yeni</span>}
            {indirim > 0 && <span className="rozet-indirim">-%{indirim}</span>}
          </div>
        </div>

        <div className="detay-bilgi">
          <Link to={`/parfumler?markaId=${parfum.markaId}`} className="ust-baslik" lang="en">
            {parfum.marka}
          </Link>
          <h1>{parfum.ad}</h1>
          <p className="detay-meta">
            {parfum.konsantrasyon} · {parfum.hacimMl} ml · {parfum.cinsiyet}
          </p>

          <div className="detay-fiyat">
            <strong className={indirim > 0 ? "indirimli" : ""}>{fiyatYaz(parfum.fiyat)}</strong>
            {indirim > 0 && (
              <>
                <s>{fiyatYaz(parfum.eskiFiyat)}</s>
                <span className="rozet-indirim">%{indirim} indirim</span>
              </>
            )}
          </div>

          <p className="detay-aciklama">{parfum.aciklama}</p>

          <section className="piramit" aria-label="Nota piramidi">
            <h2>Nota piramidi</h2>
            {KATMANLAR.map((k) => (
              <div key={k.alan} className="piramit-satir">
                <div className="piramit-etiket">
                  <strong>{k.ad}</strong>
                  <span>{k.sure}</span>
                </div>
                <div className="cipler">
                  {notalariAyir(parfum[k.alan]).map((n) => (
                    <Link
                      key={n}
                      to={`/parfumler?ara=${encodeURIComponent(n)}`}
                      className="nota-cip"
                      title={`"${n}" notası olan parfümler`}
                    >
                      <EsansIkonu ad={n} boyut={20} />
                      {n}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <div className="detay-satin">
            <button
              className="buton tam buyuk"
              disabled={tukendi || stokDoldu}
              onClick={sepeteEkle}
            >
              {tukendi ? "Tükendi" : stokDoldu ? "Stok sınırına ulaşıldı" : "Sepete ekle"}
            </button>
            <p className={parfum.stok > 0 && parfum.stok <= 5 ? "stok-uyari" : "soluk"}>
              {tukendi
                ? "Bu ürün şu an stokta yok."
                : parfum.stok <= 5
                  ? `Son ${parfum.stok} ürün`
                  : "Stokta var"}
            </p>
            {(eklendi || sepettekiAdet > 0) && (
              <p className="sepet-bilgi" role="status">
                Sepetinde {sepettekiAdet} adet var. <Link to="/sepet">Sepete git →</Link>
              </p>
            )}
          </div>

          <dl className="detay-ozellik">
            <div>
              <dt>Koku ailesi</dt>
              <dd>
                <Link to={`/parfumler?kokuAilesi=${encodeURIComponent(parfum.kokuAilesi)}`}>
                  {parfum.kokuAilesi}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Konsantrasyon</dt>
              <dd>{parfum.konsantrasyon}</dd>
            </div>
            <div>
              <dt>Hacim</dt>
              <dd>{parfum.hacimMl} ml</dd>
            </div>
            <div>
              <dt>Kimin için</dt>
              <dd>{parfum.cinsiyet}</dd>
            </div>
          </dl>
        </div>
      </article>

      {benzerler.length > 0 && (
        <section className="bolum">
          <div className="bolum-ust">
            <div>
              <h2>Benzer kokular</h2>
              <p className="soluk">{parfum.kokuAilesi} ailesinden diğer parfümler.</p>
            </div>
          </div>
          <div className="urun-izgara dortlu">
            {benzerler.map((p) => (
              <ParfumKarti key={p.id} parfum={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ParfumDetay;
