import { useAuth } from "./useAuth";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }){
  const { autenticado, carregando, isAdmin } = useAuth();

  // if (carregando) return null; // aguarda o contexto carregar antes de redirecionar
  // if (!autenticado) return <Navigate to="/login" />;
  // if (!isAdmin) return <Navigate to="/login" />;
  // return children;

  return autenticado ? children : <Navigate to="/login" />;

};
