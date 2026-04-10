import PrivateRoute from "../context/PrivateRoute";
import { MeusConteudos } from "../pages/Conteudos/MeusConteudos";
import DashboardUsuario from "../pages/DashBoardUsuario/DashBoardUsuario";
import { Route } from "react-router-dom";
import { PerfilUsuario } from "../pages/PerfilUsuario/PerfilUsuario";
import { EditarConteudo } from "../pages/Conteudos/EditarConteudo";
import ColecaoLista from "../pages/Colecoes/ColecaoLista";

export const usuarioRoutes = [
  <Route
    path="/dashboard"
    element={
      <PrivateRoute>
        <DashboardUsuario />
      </PrivateRoute>
    }
    key="usuario-id"
  />,

  <Route
    path="/userProfile"
    element={
      <PrivateRoute>
        <PerfilUsuario />
      </PrivateRoute>
    }
    key="usuario-profile"
  />,
  
  <Route
    path="/user/conteudos/:tipo"
    element={
      <PrivateRoute>
        <MeusConteudos />
      </PrivateRoute>
    }
    key="usuario-conteudos"
  />,
  <Route
    path="/conteudos/:tipo/:id/editar"
    element={
      <PrivateRoute>
        <EditarConteudo />
      </PrivateRoute>
    }
    key="usuario-editar-conteudos"
  />,
  <Route
    path="/user/colecoes"
    element={
      <PrivateRoute>
        <ColecaoLista />
      </PrivateRoute>
    }
    key="usuario-colecoes"
  />,
];
