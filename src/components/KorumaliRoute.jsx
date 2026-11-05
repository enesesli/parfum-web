import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Giriş yapılmadıysa içeriği göstermek yerine giriş sayfasına yönlendirir
function KorumaliRoute({ children }) {
  const { girisYapildi } = useAuth();
  const konum = useLocation();

  if (!girisYapildi) {
    return <Navigate to="/giris" replace state={{ geri: konum.pathname }} />;
  }

  return children;
}

export default KorumaliRoute;
