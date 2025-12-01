// src/routes/marketplaceRoutes.jsx
import { Route } from "react-router-dom";
import PrivateRoute from "../context/PrivateRoute";
import MarketplaceHome from "../pages/Marketplace/MarketplaceHome";
import MarketplaceItem from "../pages/Marketplace/MarketplaceItem";
import MarketplaceCreate from "../pages/Marketplace/MarketplaceCreate";
import MarketplaceEdit from "../pages/Marketplace/MarketplaceEdit";

export const MarketplaceRoutes = [
  // MarketPlace Home
  <Route path="/marketplace/anuncios" element={<MarketplaceHome />} key="marketplace-id" />,

  // MarketPlace Produto - Ver produto por tipo e id
  <Route
    path="/marketplace/anuncios/:tipo/:id"
    element={<MarketplaceItem />}
    key="marketplace-item-id"
  />,

// MarkeplaceCreate - Criar novo anuncio
  <Route
    path="/marketplace/anunciar"
    element={
      <PrivateRoute>
        <MarketplaceCreate />
      </PrivateRoute>
    }
    key="criar-anuncio"
    />,
  
// Edita Anuncio
  <Route
    path="/marketplace/anuncios/:tipo/:id/editar"
    element={
      <PrivateRoute>
        <MarketplaceEdit />
      </PrivateRoute>
    }
    key="editar-anuncio"
  />,
];
