import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SiparisSorgula() {
  const navigate = useNavigate();
  const [no, setNo] = useState("");
  const [eposta, setEposta] = useState("");

  function gonder(e) {
    e.preventDefault();
    navigate(`/siparis/${no.trim().toUpperCase()}?eposta=${encodeURIComponent(eposta.trim())}`);
  }

  return (
    <form className="giris-formu" onSubmit={gonder}>
      <h1>Sipariş sorgula</h1>
      <p className="soluk">Sipariş numaranı ve siparişte kullandığın e-postayı gir.</p>
      <label>
        Sipariş numarası
        <input value={no} onChange={(e) => setNo(e.target.value)} placeholder="ES..." required />
      </label>
      <label>
        E-posta
        <input type="email" value={eposta} onChange={(e) => setEposta(e.target.value)} required />
      </label>
      <button className="buton tam">Sorgula</button>
    </form>
  );
}

export default SiparisSorgula;
