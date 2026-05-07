import api from "./api";

const BASE = "/userProfile";

export const fetchMeusConteudos = (tipo) =>
  api.get(`${BASE}/me/conteudos`, { params: tipo ? { tipo } : {} });

export const fetchMinhasColecoes = () => api.get(`${BASE}/me/colecoes`);

export const fetchMeusTopicos = () => api.get(`${BASE}/me/topicos`);

export const fetchMinhasPostagens = () => api.get(`${BASE}/me/posts`);

export const fetchMeusLikes = () => api.get(`${BASE}/me/likes`);

export const fetchMeusComentarios = () =>
  api.get(`${BASE}/me/comentarios`);