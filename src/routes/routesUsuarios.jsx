import PrivateRoute from "../context/PrivateRoute";
import { MeusConteudos } from "../pages/MeusConteudos/MeusConteudos";
import DashboardUsuario from "../pages/DashBoardUsuario/DashBoardUsuario";
import { Route } from "react-router-dom";
import { EditarNoticia } from "../pages/Noticias/EditarNoticia";
import { EditarEvento } from "../pages/Eventos/EditarEvento";

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
    path="/conteudos"
    element={
      <PrivateRoute>
        <MeusConteudos />
      </PrivateRoute>
    }
    key="usuario-conteudos"
  />,
  <Route
    path="/noticias/:id/editar"
    element={
      <PrivateRoute>
        <EditarNoticia />
      </PrivateRoute>
    }
    key="usuario-editar"
  />,
  <Route
    path="/eventos/:id/editar"
    element={
      <PrivateRoute>
        <EditarEvento/>
      </PrivateRoute>
    }
    key="usuario-editar"
  />,

];
