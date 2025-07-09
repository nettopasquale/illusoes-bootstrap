import { Route } from "react-router-dom";
import Anuncios from "../pages/Anuncios/Anuncios";
import CriarAnuncio from "../pages/Anuncios/CriarAnuncio";
import PrivateRoute from "../context/PrivateRoute";

export const anunciosRoutes = [
  <Route path="/anuncios/:id" element={<Anuncios />} key="anuncios-id" />,
  <Route path="/anuncios/:id/new" element={
    <PrivateRoute>
      <CriarAnuncio />
    </PrivateRoute>
  } key="criar-anuncio" />
];
