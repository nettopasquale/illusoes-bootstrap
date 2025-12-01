import PrivateRoute from "../context/PrivateRoute";
import { MeusConteudos } from "../pages/MeusConteudos/MeusConteudos";
import DashboardUsuario from "../pages/DashBoardUsuario/DashBoardUsuario";
import { Route } from "react-router-dom";
import { PerfilUsuario } from "../pages/PerfilUsuario/PerfilUsuario";
import { EditarConteudo } from "../pages/Conteudos/EditarContudo";
import ColecaoLista from "../pages/Colecoes/ColecaoLista"
import MarketplaceLista from "../pages/Marketplace/MarketplaceLista";
import ForumUserProfile from "../pages/Forum/ForumUserProfile";

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
    path="/userForumProfile"
    element={
      <PrivateRoute>
        <ForumUserProfile />
      </PrivateRoute>
    }
    key="usuario-forum-profile"
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
   <Route
    path="/user/marketplace/meus-anuncios"
    element={
      <PrivateRoute>
        <MarketplaceLista />
      </PrivateRoute>
    }
    key="usuario-anuncios"
  />,

];
