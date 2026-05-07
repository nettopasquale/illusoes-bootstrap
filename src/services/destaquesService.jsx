import api from "./api";

const BASE = "/conteudos";

export const listarDestaques = (limite = 5) =>
  api.get(`${BASE}/destaques`, { params: { limite } });
