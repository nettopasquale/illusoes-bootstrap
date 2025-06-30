import { useAuth } from "./useAuth";

export default function PrivateRoute({ children }){
  const { autenticado } = useAuth();
  return autenticado ? children : <Navigate to="/login" />;
};
