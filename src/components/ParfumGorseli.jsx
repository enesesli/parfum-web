import { gorselAdresi } from "../api";
import SiseGorseli from "./SiseGorseli";

// Ürünün fotoğrafı varsa onu, yoksa rengine göre çizilmiş şişeyi gösterir
function ParfumGorseli({ parfum, className = "" }) {
  if (parfum.gorselYolu) {
    return (
      <img
        className={`urun-foto ${className}`}
        src={gorselAdresi(parfum.gorselYolu)}
        alt={`${parfum.marka} ${parfum.ad}`}
        loading="lazy"
      />
    );
  }

  return (
    <SiseGorseli
      className={className}
      renk={parfum.renk}
      tip={parfum.siseTipi ?? 0}
      harf={(parfum.marka ?? "E").charAt(0)}
      baslik={`${parfum.ad} şişesi`}
    />
  );
}

export default ParfumGorseli;
