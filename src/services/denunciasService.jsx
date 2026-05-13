import api from "./api";

const BASE = "/denuncias";

// Usuário
export const listarMinhasDenuncias = () => api.get(`/userProfile/me${BASE}`);
export const criarDenuncia = (data) => api.post(BASE, data);
export const cancelarDenuncia = (id) => api.delete(`${BASE}/${id}`);
export const buscarDenunciaPorId = (id) => api.get(`${BSE}/${id}`);

// Admin
export const listarTodasDenuncias  = (status) =>
  api.get(BASE, { params: status ? { status } : {} });
export const avaliarDenuncia       = (id, data) =>
  api.patch(`${BASE}/${id}`, data);