import { Route } from "react-router-dom";
import ColecoesHome from "../pages/Colecoes/ColecoesHome";
import CriarColecao from "../pages/Colecoes/CriarColecao";
import ColecaoView from "../pages/Colecoes/ColecaoView";
import ColecaoEdicao from "../pages/Colecoes/ColecaoEdicao";
import PrivateRoute from "../context/PrivateRoute";

export const colecoesRoutes = [
  <Route path="/colecoes" element={<ColecoesHome />} key="colecoes-home" />,

  <Route path="/colecoes/:id" element={<ColecaoView />} key="colecoes-id" />,

  <Route path="/colecoes/:id/editar" element={<ColecaoEdicao />} key="colecoes-id-editar" />,
  
  <Route path="/colecoes/criar" element={
    <PrivateRoute>
      <CriarColecao />
    </PrivateRoute>
  } key="criar-colecao" />
];
