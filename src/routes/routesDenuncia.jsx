import PrivateRoute from "../context/PrivateRoute";
import { Route } from "react-router-dom";
import ListarDenuncias from "../pages/Denuncia/ListarDenuncias";
import AvaliarDenuncia from "../pages/Denuncia/AvaliarDenuncia";

export const denunciaRoutes = [
  <Route
    path="/denuncias"
    element={
      <PrivateRoute>
        <ListarDenuncias />
      </PrivateRoute>
    }
    key="denuncias"
  />,

  <Route
    path="/denuncias/:id/avaliar"
    element={
      <PrivateRoute>
        <AvaliarDenuncia />
      </PrivateRoute>
    }
    key="usuario-profile"
  />,
];
