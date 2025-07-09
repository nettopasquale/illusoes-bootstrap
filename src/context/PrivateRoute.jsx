import { useAuth } from "./useAuth";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }){
  const { autenticado } = useAuth();
  return autenticado ? children : <Navigate to="/login" />;
};
