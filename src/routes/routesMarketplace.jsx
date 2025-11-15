// src/routes/marketplaceRoutes.jsx
import { Route } from "react-router-dom";
import PrivateRoute from "../context/PrivateRoute";
import MarketplaceHome from "../pages/Marketplace/MarketplaceHome";
import MarketplaceItem from "../pages/Marketplace/MarketplaceItem";
import MarketplaceCreate from "../pages/Marketplace/MarketplaceCreate";
import MarketplaceEdit from "../pages/Marketplace/MarketplaceEdit";

export const MarketplaceRoutes = [
  // MarketPlace Home
  <Route path="/marketplace" element={<MarketplaceHome />} key="marketplace-id" />,

  // MarketPlace Produto
  <Route
    path="/marketplace/:id"
    element={<MarketplaceItem />}
    key="marketplace-item-id"
  />,

// MarkeplaceCreate
  <Route
    path="/marketplace/anunciar"
    element={
      <PrivateRoute>
        <MarketplaceCreate />
      </PrivateRoute>
    }
    key="criar-anuncio"
    />,
  
// Edit
  <Route
    path="/marketplace/:id/editar"
    element={
      <PrivateRoute>
        <MarketplaceEdit />
      </PrivateRoute>
    }
    key="editar-anuncio"
  />,
];
