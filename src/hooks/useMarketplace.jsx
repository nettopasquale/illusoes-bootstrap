// src/hooks/useMarketplace.js
import { useState } from "react";
import flareon from "../assets/imgs/Pokemon/flareon_tcg.jpg";
import knight from "../assets/imgs/Digimon/1BT2-020__sasasi_jpg.jpg";

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
        titulo: "Deck Starter - 60 cartas (bom estado)",
        preco: 120.0,
        frete: 0.0,
        tipo: "venda",
        categoria: "deck",
        vendedor: "Usuário X",
        localizacao: "São Paulo, SP",
        capa: knight,
        condicao: "Usado",
        descricao: "Deck completo de início com cartas sinérgicas.",
        imagem: [""],
        createdAt: "2025-10-01T12:00:00Z",
      },
      {
        id: "m2",
        titulo: "Carta rara - Dragão de Fogo Supremo",
        preco: 350.0,
        frete: 0.0,
        tipo: "venda",
        categoria: "deck",
        vendedor: "user999",
        localizacao: "Rio de Janeiro, RJ",
        capa: flareon,
        condicao: "Novo",
        descricao: "Carta rara em perfeito estado, com proteção.",
        imagem:[""],
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
      titulo: "Carta rara - Flareon Fogo Supremo",
      preco: 350,
      frete: 0.0,
      tipo: "venda",
      categoria: "deck",
      vendedor: "Pasquale",
      localizacao: "São Paulo, SP",
      capa: flareon,
      condicao: "Novo",
      imagem: [""],
      descricao:
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
