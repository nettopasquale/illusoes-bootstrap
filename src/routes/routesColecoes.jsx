import { Route } from "react-router-dom";
import MinhasColecoes from "../pages/Colecoes/MinhasColecoes";
import CriarColecao from "../pages/Colecoes/CriarColecao";
import ColecaoView from "../pages/Colecoes/ColecaoView";
import ColecaoEdicao from "../pages/Colecoes/ColecaoEdicao";
import PrivateRoute from "../context/PrivateRoute";
import ColecaoLista from "../pages/Colecoes/ColecaoLista";
import ColecaoCarta from "../pages/Colecoes/ColecaoCarta";

export const colecoesRoutes = [
  //todas as coleções existentes
  <Route path="/colecoes" element={<ColecaoLista />} key="colecoes-home" />,

  // editar entidade coleção
  <Route
    path="/colecoes/:id/editar"
    element={
      <PrivateRoute>
        <ColecaoEdicao />
      </PrivateRoute>
    }
    key="colecoes-id-editar"
  />,

  //adicionar cartas na coleção
  <Route
    path="/colecoes/:id/cartas"
    element={
      <PrivateRoute>
        <ColecaoCarta />
      </PrivateRoute>
    }
    key="colecoes-id-editar"
  />,

  <Route
    path="/colecoes/criar"
    element={
      <PrivateRoute>
        <CriarColecao />
      </PrivateRoute>
    }
    key="criar-colecao"
  />,
  <Route path="/colecoes/:id" element={<ColecaoView />} key="colecoes-id" />,
];
