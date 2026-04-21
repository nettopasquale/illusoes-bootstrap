import api from "./api";

const BASE = "/forum";

//── Categorias ──────────────────────────────────────
export const listarCategorias = () =>
  api.get(`${BASE}/categorias`,);

//── Bookmarks ──────────────────────────────────────
export const listarMeusBookmarks = () =>
  api.get(`${BASE}/bookmarks`,);

export const criarBookmarkTopico = (postId) =>
  api.post(`${BASE}/topicos/${postId}/bookmarks`);

export const criarBookmarkPost = (topicoId, postId) =>
  api.post(`${BASE}/topicos/${topicoId}/postagens/${postId}/bookmarks`);

//── Tópicos ──────────────────────────────────────
export const listarTopicos = (categoria, params = {}) =>
  api.get(`${BASE}/categorias/${categoria}/topicos`, { params });


export const listarTopicosPorId = (postId) =>
  api.get(`${BASE}/categorias/topicos/${postId}`);

export const criarTopico = (data) => api.post(`${BASE}/topicos`, data);

export const editarTopico = (postId, data) =>
  api.put(`${BASE}/topicos/${postId}`, data);

export const deletarTopico = (postId) => api.delete(`${BASE}/topicos/${postId}`);

export const curtirTopico = (postId) => api.post(`${BASE}/topicos/${postId}/curtir`);

export const denunciarTopico = (postId, motivo) =>
  api.post(`${BASE}/topicos/${postId}/denunciar`, { motivo });

// ── Postagens ──────────────────────────────────────

export const publicarPostagem = (topicoId, data) =>
  api.post(`${BASE}/topicos/${topicoId}/postagens`, data);

export const editarPostagem = (topicoId, postId, data) =>
  api.put(`${BASE}/topicos/${topicoId}/postagens/${postId}`, data);

export const deletarPostagem = (topicoId, postId) =>
  api.delete(`${BASE}/topicos/${topicoId}/postagens/${postId}`);

export const curtirPostagem = (topicoId, postId) =>
  api.post(`${BASE}/topicos/${topicoId}/postagens/${postId}/curtir`);

export const denunciarPostagem = (topicoId, postId, motivo) =>
  api.post(`${BASE}/topicos/${topicoId}/postagens/${postId}/denunciar`, {
    motivo,
  });