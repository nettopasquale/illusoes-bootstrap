import PrivateRoute from "../context/PrivateRoute";
import { MeusConteudos } from "../pages/Conteudos/MeusConteudos";
import DashboardUsuario from "../pages/DashBoardUsuario/DashBoardUsuario";
import { Route } from "react-router-dom";
import { PerfilUsuario } from "../pages/PerfilUsuario/PerfilUsuario";
import { EditarConteudo } from "../pages/Conteudos/EditarConteudo";
import MinhasColecoes from "../pages/Colecoes/MinhasColecoes";
import ColecaoLista from "../pages/Colecoes/ColecaoLista";
import ForumPaginaCategoria from "../pages/Forum/ForumPaginaCategoria";

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
    path="/user/profile"
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

  // ver as minhas coleções
  <Route
    path="/user/colecoes"
    element={
      <PrivateRoute>
        <MinhasColecoes />
      </PrivateRoute>
    }
    key="colecoes-id"
  />,

  <Route
    path="/user/topicos"
    element={
      <PrivateRoute>
        <ForumPaginaCategoria />
      </PrivateRoute>
    }
    key="forum-topico-criar"
  />,

  <Route
    path="/user/posts"
    element={
      <PrivateRoute>
        <ForumPaginaCategoria />
      </PrivateRoute>
    }
    key="forum-topico-criar"
  />,
];
