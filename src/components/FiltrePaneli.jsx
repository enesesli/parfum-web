import { KOKU_AILELERI, KONSANTRASYONLAR } from "../yardimci";

// Tek seçimli düğme grubu: aynı düğmeye tekrar basınca seçim kalkar
function SecimGrubu({ baslik, ad, secenekler, params, degistir }) {
  const secili = params.get(ad) ?? "";
  return (
    <fieldset className="filtre-grup">
      <legend>{baslik}</legend>
      <div className="cipler">
        {secenekler.map((s) => (
          <button
            type="button"
            key={s}
            className={secili === s ? "cip secili" : "cip"}
            aria-pressed={secili === s}
            onClick={() => degistir(ad, secili === s ? "" : s)}
          >
            {s}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function FiltrePaneli({ params, markalar, degistir, temizle, acik, kapat }) {
  const deger = (ad) => params.get(ad) ?? "";

  return (
    <aside className={acik ? "filtre-paneli acik" : "filtre-paneli"} aria-label="Filtreler">
      <div className="filtre-baslik">
        <h2>Filtreler</h2>
        <button type="button" className="link-buton" onClick={temizle}>
          Temizle
        </button>
      </div>

      <SecimGrubu
        baslik="Koku ailesi"
        ad="kokuAilesi"
        secenekler={KOKU_AILELERI.map((k) => k.ad)}
        params={params}
        degistir={degistir}
      />

      <fieldset className="filtre-grup">
        <legend>Marka</legend>
        <select value={deger("markaId")} onChange={(e) => degistir("markaId", e.target.value)}>
          <option value="">Tüm markalar</option>
          {markalar.map((m) => (
            <option key={m.id} value={m.id}>
              {m.ad} ({m.parfumSayisi})
            </option>
          ))}
        </select>
      </fieldset>

      <SecimGrubu
        baslik="Kimin için"
        ad="cinsiyet"
        secenekler={["Kadın", "Erkek", "Unisex"]}
        params={params}
        degistir={degistir}
      />

      <SecimGrubu
        baslik="Konsantrasyon"
        ad="konsantrasyon"
        secenekler={KONSANTRASYONLAR}
        params={params}
        degistir={degistir}
      />

      <fieldset className="filtre-grup">
        <legend>Fiyat aralığı (₺)</legend>
        <div className="fiyat-araligi">
          <input
            type="number"
            min="0"
            placeholder="En az"
            aria-label="En az fiyat"
            value={deger("minFiyat")}
            onChange={(e) => degistir("minFiyat", e.target.value)}
          />
          <span>–</span>
          <input
            type="number"
            min="0"
            placeholder="En çok"
            aria-label="En çok fiyat"
            value={deger("maxFiyat")}
            onChange={(e) => degistir("maxFiyat", e.target.value)}
          />
        </div>
      </fieldset>

      <fieldset className="filtre-grup">
        <legend>Öne çıkanlar</legend>
        <label className="onay">
          <input
            type="checkbox"
            checked={deger("yeni") === "true"}
            onChange={(e) => degistir("yeni", e.target.checked ? "true" : "")}
          />
          Sadece yeni gelenler
        </label>
        <label className="onay">
          <input
            type="checkbox"
            checked={deger("indirimli") === "true"}
            onChange={(e) => degistir("indirimli", e.target.checked ? "true" : "")}
          />
          Sadece indirimdekiler
        </label>
      </fieldset>

      {kapat && (
        <button type="button" className="buton tam filtre-kapat" onClick={kapat}>
          Sonuçları göster
        </button>
      )}
    </aside>
  );
}

export default FiltrePaneli;
