import { useAuth } from "./useAuth";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }){
  const { autenticado, isAdmin } = useAuth();

  if (!autenticado) return <Navigate to="/login" />
  if (!isAdmin) return <Navigate to="/" />

  return children
};
