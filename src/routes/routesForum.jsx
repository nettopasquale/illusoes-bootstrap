import { Route } from "react-router-dom";
import PrivateRoute from "../context/PrivateRoute";
import Forum from "../pages/Forum/Forum";

export const forumRoutes = [
  // Home Forum
  <Route path="/forum" element={<Forum />} key="forum-id" />,

  // id Secao
  <Route path="/forum/:secao/:id" element={<Forum />} key="forum-secao-id" />,

  // Secoes
  <Route path="/forum/:secao" element={<Forum />} key="listar-noticias" />,

  //Subforuns
  <Route path="/forum/:subforum" element={<Forum />} key="forum-subforum" />,

  // criar Tópico
  <Route
    path="/forum/:secao/:subforum/criar"
    element={
      <PrivateRoute>
        <Forum />
      </PrivateRoute>
    }
    key="criar-topico"
  />,

  // criar post ?
  <Route
    path="/forum/:secao/:subforum/postar"
    element={
      <PrivateRoute>
        <Forum />
      </PrivateRoute>
    }
    key="postar-topico"
  />,
];
