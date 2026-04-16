import { Route } from "react-router-dom";
import PrivateRoute from "../context/PrivateRoute";
import ForumTopico from "../pages/Forum/ForumTopico";
import ForumHome from "../pages/Forum/ForumHome";
import ForumPaginaCategoria from "../pages/Forum/ForumPaginaCategoria"
import ForumCriarTopico from "../pages/Forum/ForumCriarTopico";
import ForumListaBookmark from "../pages/Forum/ForumListaBookmark";


export const forumRoutes = [
  <Route
    path="/forum/categorias/topicos/:topicoId"
    element={<ForumTopico />}
    key="forum-topico-view"
  />,

  <Route
    path="/forum/categorias/topicos"
    element={<ForumPaginaCategoria />}
    key="forum-topico-view"
  />,
  
  <Route
  path="/forum/topicos/criar"
  element={
    <PrivateRoute>
        <ForumCriarTopico />
      </PrivateRoute>
    }
    key="forum-topico-criar"
    />,
    
    <Route
    path="/forum/bookmarks"
    element={
      <PrivateRoute>
        <ForumListaBookmark />
      </PrivateRoute>
    }
    key="forum-topico-criar"
    />,

    <Route
    path="/forum/categorias"
    element={<ForumPaginaCategoria />}
    key="forum-categorias-view"
    />,

    <Route path="/forum" element={<ForumHome />} key="forum-home" />,
];
