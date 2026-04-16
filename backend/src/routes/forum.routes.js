import express from "express";
import {
    publicarPostagem,
    editarPostagem,
    deletarPostagem,
    curtirPostagem,
    denunciarPostagem,
    criarBookmarkPostagem
} from "../controllers/forumPost.controller.js"
import {
    buscarTopicos,
    buscarTopicosPorID,
    buscarCategorias,
    criarTopico,
    editarTopico,
    deletarTopico,
    curtirTopico,
    denunciarTopico,
    criarBookmarkTopico,
    listarBookmarkTopico,
} from "../controllers/forumTopico.controller.js"
import {verificarAdmin, verificarToken } from "../middleware/auth.middleware.js";

const forumRouters = express.Router();

//Categorias de Tópicos
forumRouters.get('/forum/categorias', buscarCategorias);

// ── Topicos ───────────────────────────────────────
forumRouters.get("/forum/categorias/topicos/:topicoId", buscarTopicosPorID);
forumRouters.get("/forum/categorias/topicos", buscarTopicos);
forumRouters.get('/forum/topicos/bookmarks',verificarToken ,listarBookmarkTopico);

forumRouters.post("/forum/topicos", verificarToken, criarTopico);
forumRouters.post("/forum/topicos/:topicoId/curtir", verificarToken, curtirTopico);
forumRouters.post("/forum/topicos/:topicoId/denunciar", verificarToken, denunciarTopico);
forumRouters.post("/forum/topicos/:topicoId/bookmarks", verificarToken, criarBookmarkTopico);

forumRouters.put("/forum/topicos/:topicoId", verificarToken, editarTopico);

forumRouters.delete("/forum/topicos/:topicoId", verificarToken, deletarTopico);

// ── Postagens ───────────────────────────────────────
forumRouters.post(
  "/forum/topicos/:topicoId/postagens",
  verificarToken,
  publicarPostagem,
);
forumRouters.post(
  "/forum/topicos/:topicoId/postagens/:postagemId/curtir",
  verificarToken,
  curtirPostagem,
);
forumRouters.post(
  "/forum/topicos/:topicoId/postagens/:postagemId/denunciar",
  verificarToken,
  denunciarPostagem,
);

forumRouters.post(
  "/forum/topicos/:topicoId/postagens/:postagemId/bookmark",
  verificarToken,
  criarBookmarkPostagem,
);

forumRouters.put(
  "/forum/topicos/:topicoId/postagens/:postagemId",
  verificarToken,
  editarPostagem,
);
forumRouters.delete(
  "/forum/topicos/:topicoId/postagens/:postagemId",
  verificarToken,
  deletarPostagem,
);

export default forumRouters;