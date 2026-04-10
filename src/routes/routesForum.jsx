import { Route } from "react-router-dom";
import ForumTopico from "../pages/Forum/ForumTopico";


export const forumRoutes = [
  <Route
    path="/forum/topicos"
    element={<ForumTopico />}
    key="forum-topico-view"
  />,
];
