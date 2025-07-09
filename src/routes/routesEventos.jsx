import { Route } from "react-router-dom";
import { ListarEventos } from "../components/ListarConteudos/ListarEventos";
import Eventos from "../pages/Eventos/Eventos";
import { CriarEvento } from "../pages/Eventos/CriarEvento";
import PrivateRoute from "../context/PrivateRoute";

export const eventosRoutes = [
  <Route
    path="/eventos/:tipo/criar"
    element={
      <PrivateRoute>
        <CriarEvento />
      </PrivateRoute>
    }
    key="criar-evento"
  />,
  <Route path="/eventos/:tipo/:id" element={<Eventos />} key="evento-id" />,
  
  <Route
    path="/eventos/:tipo"
    element={<ListarEventos modoListaCompleta />}
    key="listar-evento"
  />,
];
