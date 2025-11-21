import { Route } from "react-router-dom";
import PrivateRoute from "../context/PrivateRoute";
import ForumHome from "../pages/Forum/ForumHome";
import ForumCategoria from "../pages/Forum/ForumCategoria";
import ForumTopico from "../pages/Forum/ForumTopico";
import ForumLista from "../pages/Forum/ForumLista";
import ForumCriarTopico from "../pages/Forum/ForumCriarTopico";
import ForumSub from "../pages/Forum/ForumSub";
import ForumUserProfile from "../pages/Forum/ForumUserProfile";

export const forumRoutes = [
  // Home Forum
  <Route path="/forum" element={<ForumHome />} key="forum-id" />,

  // Categorias
  <Route
    path="/forum/categoria"
    element={<ForumCategoria />}
    key="listar-categorias"
  />,

  // id Categoria
  <Route
    path="/forum/categoria/:categoriaId"
    element={<ForumCategoria />}
    key="forum-categoria-id"
  />,

  //Subforuns
  <Route
    path="/forum/categoria/:categoriaId/subforum/:subforumId"
    element={<ForumSub />}
    key="forum-subforum"
  />,

  //ListaTopico
  <Route
    path="/forum/categoria/:categoriaId/subforum/:subforumId/topicos"
    element={<ForumLista />}
    key="forum-lista"
  />,

  //ListaTopico - quando não tem subforum
  <Route
    path="/forum/categoria/:categoriaId/topicos"
    element={<ForumLista />}
    key="forum-lista-sem-sub"
  />,

  // criar Tópico
  <Route
    path="/forum/categoria/:categoriaId/subforum/:subforumId/criar-topico
"
    element={
      <PrivateRoute>
        <ForumCriarTopico />
      </PrivateRoute>
    }
    key="criar-topico"
  />,
  //Ver Topico
  <Route
    path="/forum/topico/:topicoId"
    element={<ForumTopico />}
    key="forum-topico-view"
  />,

  // UserProfile
  <Route
    path="/perfil/:userId"
    element={<ForumUserProfile />}
    key="forum-user-profile"
  />,
];
