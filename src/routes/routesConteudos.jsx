import { Route } from "react-router-dom";
import { ListarConteudos } from "../components/ListarConteudos/ListarConteudos";
import ConteudoView from "../pages/Conteudos/ConteudoView";
import PrivateRoute from "../context/PrivateRoute";
import { ConteudoForm } from "../pages/Conteudos/ConteudoForm";

export const conteudosRoutes = [
  <Route
    path="/conteudos/:tipo/criar"
    element={
      <PrivateRoute>
        <ConteudoForm />
      </PrivateRoute>
    }
    key="criar-conteudo"
  />,
  
  <Route
    path="/conteudos/:tipo/:id/editar"
    element={
      <PrivateRoute>
        <ConteudoForm />
      </PrivateRoute>
    }
    />,


  <Route
    path="/conteudos/:tipo/:id"
    element={<ConteudoView />}
    key="conteudo-id"
  />,


  <Route
    path="/conteudos/:tipo"
    element={<ListarConteudos modoListaCompleta />}
    key="listar-conteudo"
  />,
];
