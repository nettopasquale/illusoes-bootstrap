import { Route } from "react-router-dom";
import Noticias from "../pages/Noticias/Noticias";
import CriarNoticia from "../pages/Noticias/Criar_Noticia";
import PrivateRoute from "../context/PrivateRoute";

export const noticiasRoutes = [
  <Route path="/noticias/:tipo/:id" element={<Noticias />} key="noticia-id" />,
  <Route path="/noticias/:tipo/new" element={
    <PrivateRoute>
      <CriarNoticia />
    </PrivateRoute>
  } key="criar-noticia" />
];
