import { Route } from "react-router-dom";
import MinhasColecoes from "../pages/Colecoes/MinhasColecoes";
import CriarColecao from "../pages/Colecoes/CriarColecao";
import ColecaoView from "../pages/Colecoes/ColecaoView";
import ColecaoEdicao from "../pages/Colecoes/ColecaoEdicao";
import PrivateRoute from "../context/PrivateRoute";
import ColecaoLista from "../pages/Colecoes/ColecaoLista";
import ColecaoCarta from "../pages/Colecoes/ColecaoCarta";
import ColecaoCartaEdicao from "../pages/Colecoes/ColecaoCartaEdicao";

export const colecoesRoutes = [
  //todas as coleções existentes
  <Route path="/colecoes" element={<ColecaoLista />} key="colecoes-home" />,

  //criar coleçao
  <Route
    path="/colecoes/criar"
    element={
      <PrivateRoute>
        <CriarColecao />
      </PrivateRoute>
    }
    key="criar-colecao"
  />,

  // ver as minhas coleções
  <Route
    path="user/colecoes"
    element={
      <PrivateRoute>
        <MinhasColecoes />
      </PrivateRoute>
    }
    key="colecoes-id"
  />,

  // editar entidade coleção
  <Route
    path="/colecoes/:colecaoId/editar"
    element={
      <PrivateRoute>
        <ColecaoEdicao />
      </PrivateRoute>
    }
    key="colecoes-id-editar"
  />,

  //adicionar/remover cartas na coleção
  <Route
    path="/colecoes/:colecaoId/cartas"
    element={
      <PrivateRoute>
        <ColecaoCarta />
      </PrivateRoute>
    }
    key="colecoes-id-cartas"
  />,

  //adicionar/remover cartas na coleção
  <Route
    path="/colecoes/:colecaoId/cartas/editar"
    element={
      <PrivateRoute>
        <ColecaoCartaEdicao />
      </PrivateRoute>
    }
    key="colecoes-id-cartas"
  />,

  <Route path="/colecoes/:id" element={<ColecaoView />} key="colecoes-id-criar" />,
];
