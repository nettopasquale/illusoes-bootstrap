import { Route } from "react-router-dom";
import Eventos from "../pages/Eventos/Eventos";
import CriarEvento from "../pages/Eventos/Criar_Evento";
import PrivateRoute from "../context/PrivateRoute";

export const eventosRoutes = [
  <Route path="/eventos/:tipo/:id" element={<Eventos />} key="evento-id" />,
  <Route path="/eventos/:tipo/new" element={
    <PrivateRoute>
      <CriarEvento />
    </PrivateRoute>
  } key="criar-evento" />
];
