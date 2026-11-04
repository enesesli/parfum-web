function FiltrePaneli({ params, markalar, degistir, temizle }) {
  const deger = (ad) => params.get(ad) ?? "";

  return (
    <aside className="filtre-paneli">
      <input
        type="search"
        placeholder="Parfüm veya marka ara..."
        value={deger("ara")}
        onChange={(e) => degistir("ara", e.target.value)}
      />

      <label>
        Marka
        <select
          value={deger("markaId")}
          onChange={(e) => degistir("markaId", e.target.value)}
        >
          <option value="">Tümü</option>
          {markalar.map((m) => (
            <option key={m.id} value={m.id}>
              {m.ad} ({m.parfumSayisi})
            </option>
          ))}
        </select>
      </label>

      <label>
        Cinsiyet
        <select
          value={deger("cinsiyet")}
          onChange={(e) => degistir("cinsiyet", e.target.value)}
        >
          <option value="">Tümü</option>
          <option value="Kadın">Kadın</option>
          <option value="Erkek">Erkek</option>
          <option value="Unisex">Unisex</option>
        </select>
      </label>

      <div className="fiyat-araligi">
        <label>
          En az ₺
          <input
            type="number"
            min="0"
            value={deger("minFiyat")}
            onChange={(e) => degistir("minFiyat", e.target.value)}
          />
        </label>
        <label>
          En çok ₺
          <input
            type="number"
            min="0"
            value={deger("maxFiyat")}
            onChange={(e) => degistir("maxFiyat", e.target.value)}
          />
        </label>
      </div>

      <label>
        Sırala
        <select
          value={deger("sirala")}
          onChange={(e) => degistir("sirala", e.target.value)}
        >
          <option value="">Önerilen</option>
          <option value="fiyat">Fiyat: düşükten yükseğe</option>
          <option value="fiyat_azalan">Fiyat: yüksekten düşüğe</option>
          <option value="ad">Ada göre (A-Z)</option>
        </select>
      </label>

      <button type="button" className="ikincil-buton" onClick={temizle}>
        Filtreleri temizle
      </button>
    </aside>
  );
}

export default FiltrePaneli;
