import { Route } from "react-router-dom";
import PrivateRoute from "../context/PrivateRoute";
import { PerfilUsuario } from "../pages/PerfilUsuario/PerfilUsuario";
import MeusConteudos from "../pages/Conteudos/MeusConteudos";
import DashboardUsuario from "../pages/DashBoardUsuario/DashBoardUsuario";
import MinhasColecoes from "../pages/Colecoes/MinhasColecoes";
import ColecaoLista from "../pages/Colecoes/ColecaoLista";
import ForumPaginaCategoria from "../pages/Forum/ForumPaginaCategoria";
import ListarDenuncias from "../pages/Denuncia/ListarDenuncias";
import MeusTopicosPosts from "../pages/Forum/MeusTopicosPosts";
import MeusComentariosCurtidas from "../pages/ComentariosCurtidas/MeusComentariosCurtidas";
import RedefinirSenha from "../pages/PerfilUsuario/RedefinirSenha";
import EsqueceuSenha from "../pages/PerfilUsuario/EsqueceuSenha";


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
    path="/users/esqueceu-senha"
    element={
      <EsqueceuSenha />
    }
    key="usuario-id"
  />,

  <Route
    path="/users/redefinir-senha/:token"
    element={
        <RedefinirSenha />

    }
    key="usuario-id"
  />,

  <Route
    path="/userProfile/me"
    element={
      <PrivateRoute>
        <PerfilUsuario />
      </PrivateRoute>
    }
    key="usuario-profile"
  />,

  <Route
    path="/userProfile/me/conteudos"
    element={
      <PrivateRoute>
        <MeusConteudos />
      </PrivateRoute>
    }
    key="usuario-conteudos"
  />,

  // ver as minhas coleções
  <Route
    path="/userProfile/me/colecoes"
    element={
      <PrivateRoute>
        <MinhasColecoes />
      </PrivateRoute>
    }
    key="usuario-colecoes"
  />,

  <Route
    path="/userProfile/me/topicos"
    element={
      <PrivateRoute>
        <MeusTopicosPosts />
      </PrivateRoute>
    }
    key="usuario-topicos-posts"
  />,

  <Route
    path="/userProfile/me/comentarios"
    element={
      <PrivateRoute>
        <MeusComentariosCurtidas />
      </PrivateRoute>
    }
    key="usuario-topicos-posts"
  />,
];
