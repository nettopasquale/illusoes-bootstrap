import { Route } from "react-router-dom";
import { ListarConteudos } from "../components/ListarConteudos/ListarConteudos";
import ConteudoView from "../pages/Conteudos/ConteudoView";
import { CriarConteudo } from "../pages/Conteudos/CriarConteudo";
import PrivateRoute from "../context/PrivateRoute";
import { EditarConteudo } from "../pages/Conteudos/EditarContudo";

export const conteudosRoutes = [
  <Route
    path="/conteudos/:tipo/criar"
    element={
      <PrivateRoute>
        <CriarConteudo />
      </PrivateRoute>
    }
    key="criar-conteudo"
  />,

  <Route
    path="/conteudos/:tipo/:id/editar"
    element={
      <PrivateRoute>
        <EditarConteudo />
      </PrivateRoute>
    }
    key="editar-conteudo"
  />,
  <Route path="/conteudos/:tipo/:id" element={<ConteudoView />} key="conteudo-id" />,
  
  <Route
    path="/conteudos/:tipo"
    element={<ListarConteudos modoListaCompleta />}
    key="listar-conteudo"
  />,
];
