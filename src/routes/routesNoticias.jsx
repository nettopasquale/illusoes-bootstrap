import { Route } from "react-router-dom";
import { ListarNoticias } from "../components/ListarConteudos/ListarNoticias";
import Noticias from "../pages/Noticias/Noticias";
import { CriarNoticia } from "../pages/Noticias/CriarNoticia";
import PrivateRoute from "../context/PrivateRoute";

export const noticiasRoutes = [
  <Route
    path="/noticias/:tipo/criar"
    element={
      <PrivateRoute>
        <CriarNoticia />
      </PrivateRoute>
    }
    key="criar-noticia"
  />,

  <Route path="/noticias/:tipo/:id" element={<Noticias />} key="noticia-id" />,

  <Route
    path="/noticias/:tipo"
    element={<ListarNoticias modoListaCompleta />}
    key="listar-noticias"
  />,
];
