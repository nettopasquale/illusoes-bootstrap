import api from "./api";

const BASE = "/forum";

//── Categorias ──────────────────────────────────────
export const listarCategorias = () =>
  api.get(`${BASE}/topicos/categorias`,);

//── Bookmarks ──────────────────────────────────────
export const listarMeusBookmarks = () =>
  api.get(`${BASE}/topicos/bookmarks`,);

export const criarBookmarkTopico = (id) =>
  api.post(`${BASE}/topicos/${id}/bookmarks`,);

export const criarBookmarkPost = (topicoId, postId) =>
  api.post(`${BASE}/topicos/${topicoId}/postagens/${postId}/bookmarks`);

//── Tópicos ──────────────────────────────────────
export const listarTopicos = (params = {}) =>
  api.get(`${BASE}/topicos`, { params });

export const listarTopicosPorId = (id) => api.get(`${BASE}/topicos/${id}`);

export const criarTopico = (data) => api.post(`${BASE}/topicos`, data);

export const editarTopico = (id, data) => api.put(`${BASE}/topicos/${id}`, data);

export const deletarTopico = (id) => api.delete(`${BASE}/topicos/${id}`);

export const curtirTopico = (id) => api.post(`${BASE}/topicos/${id}/curtir`);

export const denunciarTopico = (id, motivo) =>
  api.post(`${BASE}/topicos/${id}/denunciar`, { motivo });

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