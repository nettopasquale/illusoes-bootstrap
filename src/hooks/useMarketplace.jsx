// src/hooks/useMarketplace.js
import { useState } from "react";

/**
 * Hook para centralizar operações do marketplace.
 * Atualmente com mocks; substitua os TODOs pelo seu backend real.
 */
export default function useMarketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // GET - LISTAR ANÚNCIOS
  // ============================================================
  const loadItems = async (filters = {}) => {
    setLoading(true);

    // ========== MOCK ==========
    // TODO: integrar com backend ~ GET /api/marketplace
    const data = [
      {
        id: "m1",
        title: "Deck Starter - 60 cartas (bom estado)",
        price: 120.0,
        currency: "BRL",
        seller: "user123",
        sellerName: "Pasquale",
        location: "São Paulo, SP",
        cover: "https://images.unsplash.com/photo-1602524208024-9b4f0d1f6f6a?w=800",
        condition: "Usado - Bom",
        description: "Deck completo de início com cartas sinérgicas.",
        createdAt: "2025-10-01T12:00:00Z",
      },
      {
        id: "m2",
        title: "Carta rara - Dragão de Fogo Supremo",
        price: 350.0,
        currency: "BRL",
        seller: "user999",
        sellerName: "ColecionadorArcano",
        location: "Rio de Janeiro, RJ",
        cover: "https://images.unsplash.com/photo-1580910051070-1c6b2b3f8b2d?w=800",
        condition: "Novo",
        description: "Carta rara em perfeito estado, com proteção.",
        createdAt: "2025-11-02T09:10:00Z",
      },
    ];

    await new Promise((r) => setTimeout(r, 600));
    setItems(data);
    setLoading(false);
  };

  // ============================================================
  // GET - PEGAR UM ITEM PELO ID
  // ============================================================
  const getItemById = async (id) => {
    setLoading(true);

    // TODO: GET /api/marketplace/:id
    await new Promise((r) => setTimeout(r, 400));

    const mock = {
      id,
      title: "Carta rara - Dragão de Fogo Supremo",
      price: 350,
      currency: "BRL",
      sellerId: "user123", // dono mockado
      sellerName: "Pasquale",
      location: "São Paulo, SP",
      condition: "Novo",
      images: [
        "https://images.unsplash.com/photo-1580910051070-1c6b2b3f8b2d?w=1000",
        "https://images.unsplash.com/photo-1602524208024-9b4f0d1f6f6a?w=1000",
      ],
      description:
        "Carta rara em perfeito estado. Inclui sleeve premium. Envio por PAC/SEDEX.",
      createdAt: "2025-11-02T09:10:00Z",
    };

    setLoading(false);
    return mock;
  };

  // ============================================================
  // POST - CRIAR ANÚNCIO
  // ============================================================
  const createListing = async (payload) => {
    // TODO: POST /api/marketplace
    console.log("CRIANDO (mock):", payload);
    await new Promise((r) => setTimeout(r, 600));
    return { success: true, id: Date.now().toString() };
  };

  // ============================================================
  // PUT - EDITAR ANÚNCIO
  // ============================================================
  const updateListing = async (id, payload) => {
    // TODO: PUT /api/marketplace/:id
    console.log("EDITANDO (mock):", { id, ...payload });

    await new Promise((r) => setTimeout(r, 600));

    return { success: true };
  };

  // ============================================================
  // DELETE - EXCLUIR ANÚNCIO
  // ============================================================
  const deleteListing = async (id) => {
    // TODO: DELETE /api/marketplace/:id
    console.log("DELETANDO (mock):", id);

    await new Promise((r) => setTimeout(r, 600));

    return { success: true };
  };

  return {
    items,
    loading,

    // CRUD
    loadItems,
    getItemById,
    createListing,
    updateListing,
    deleteListing,
  };
}
