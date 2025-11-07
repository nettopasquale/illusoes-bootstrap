import { Route } from "react-router-dom";
import PrivateRoute from "../context/PrivateRoute";
import ForumHome from "../pages/Forum/ForumHome";
import ForumCategoria from "../pages/Forum/ForumCategoria";
import ForumTopico from "../pages/Forum/ForumTopico";
import ForumLista from "../pages/Forum/ForumLista";
import ForumCriarTopico from "../pages/Forum/ForumCriarTopico";
import ForumSub from "../pages/Forum/ForumSub";
import ForumTopicoView from "../pages/Forum/ForumTopicoView";
import ForumUserProfile from "../pages/Forum/ForumUserProfile";

export const forumRoutes = [
  // Home Forum
  <Route path="/forum" element={<ForumHome />} key="forum-id" />,

  // UserProfile
  <Route
    path="/forum/:user"
    element={<ForumUserProfile />}
    key="forum-user-profile"
  />,

  // id Categoria
  <Route
    path="/forum/:secao/:id"
    element={<ForumCategoria />}
    key="forum-secao-id"
  />,

  // Categorias
  <Route
    path="/forum/:secao"
    element={<ForumCategoria />}
    key="listar-secoes"
  />,

  //Subforuns
  <Route path="/forum/:subforum" element={<ForumSub />} key="forum-subforum" />,

  //ListaTopico
  <Route path="/forum/topico" element={<ForumLista />} key="forum-lista" />,

  //Topico
  <Route path="/forum/:topico" element={<ForumTopico />} key="forum-topico" />,

  //Ver Topico
  <Route
    path="/forum/:topico/:id"
    element={<ForumTopicoView />}
    key="forum-topico-view"
  />,

  // criar Tópico
  <Route
    path="/forum/:secao/:subforum/criar"
    element={
      <PrivateRoute>
        <ForumCriarTopico />
      </PrivateRoute>
    }
    key="criar-topico"
  />,

  // criar post ?
  <Route
    path="/forum/:secao/:subforum/postar"
    element={
      <PrivateRoute>
        <ForumHome />
      </PrivateRoute>
    }
    key="postar-topico"
  />,
];
