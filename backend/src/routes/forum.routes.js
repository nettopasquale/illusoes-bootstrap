import express from "express";
import {
    publicarPostagem,
    editarPostagem,
    deletarPostagem,
    curtirPostagem,
    criarBookmarkPostagem
} from "../controllers/forumPost.controller.js"
import {
  buscarTopicos,
  buscarTopicosPorID,
  buscarCategorias,
  criarTopico,
  curtirTopico,
  editarTopico,
  deletarTopico,
  criarBookmarkTopico,
  listarBookmarks,
} from "../controllers/forumTopico.controller.js";
import {
  verificarAdmin,
  verificarToken,
  verificarBanido,
} from "../middleware/auth.middleware.js";

const forumRouters = express.Router();

//Categorias de Tópicos
forumRouters.get('/forum/categorias', buscarCategorias);

forumRouters.get(
  "/forum/bookmarks",
  verificarToken,
  verificarBanido,
  listarBookmarks,
);
forumRouters.get("/forum/categorias/topicos", buscarTopicos);

// ── Topicos ───────────────────────────────────────
forumRouters.get("/forum/categorias/topicos/:topicoId", buscarTopicosPorID);
forumRouters.get("/forum/categorias/:categoria/topicos", buscarTopicos);

forumRouters.post("/forum/topicos", verificarToken, verificarBanido, criarTopico);
forumRouters.post(
  "/forum/topicos/:topicoId/bookmarks",
  verificarToken,
  verificarBanido,
  criarBookmarkTopico,
);
forumRouters.post("/forum/topicos/:topicoId/curtidas", 
  verificarToken, 
  verificarBanido,
   curtirTopico);

forumRouters.put("/forum/topicos/:topicoId", 
  verificarToken,
   verificarBanido,
   editarTopico);

forumRouters.delete("/forum/topicos/:topicoId", 
  verificarToken,
  verificarBanido,
  deletarTopico);

// ── Postagens ───────────────────────────────────────
forumRouters.post(
  "/forum/topicos/:topicoId/postagens",
  verificarToken,
  verificarBanido,
  publicarPostagem,
);
forumRouters.post(
  "/forum/topicos/:topicoId/postagens/:postagemId/curtidas",
  verificarToken,
  verificarBanido,
  curtirPostagem,
);

forumRouters.post(
  "/forum/topicos/:topicoId/postagens/:postagemId/bookmarks",
  verificarToken,
  verificarBanido,
  criarBookmarkPostagem,
);

forumRouters.put(
  "/forum/topicos/:topicoId/postagens/:postagemId",
  verificarToken,
  verificarBanido,
  editarPostagem,
);
forumRouters.delete(
  "/forum/topicos/:topicoId/postagens/:postagemId",
  verificarToken,
  verificarBanido,
  deletarPostagem,
);

export default forumRouters;