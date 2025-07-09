import { Route } from "react-router-dom";
import Colecoes from "../pages/Colecoes/Colecoes";
import CriarColecao from "../pages/Colecoes/CriarColecao";
import PrivateRoute from "../context/PrivateRoute";

export const colecoesRoutes = [
  <Route path="/colecoes/:id" element={<Colecoes />} key="colecoes-id" />,
  <Route path="/colecoes/:id/new" element={
    <PrivateRoute>
      <CriarColecao />
    </PrivateRoute>
  } key="criar-colecao" />
];
