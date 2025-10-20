import express from "express";
import {
    criarTopico,
    buscarTopicos,
    responderTopico,
    editarPostagem,
    trancarTopico,
    excluirPostagem,
    excluirTopico
} from "../controllers/forum.controller.js";
import {verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";

const forumRouters = express.Router();

//Buscar tópicos (com filtros)
forumRouters.get('/forum', buscarTopicos);

//Tópicos
forumRouters.post('/forum', verificarToken, criarTopico);
forumRouters.put('/forum/:id/trancar', verificarToken, verificarAdmin, trancarTopico);
forumRouters.delete('/forum/:id', verificarToken, verificarAdmin, excluirTopico);

//Postagens
forumRouters.post('/forum/:topicoId/responder', verificarToken, responderTopico);
forumRouters.put('/postagens/:id', verificarToken, editarPostagem);
forumRouters.delete('/postagens/:id', verificarToken, excluirPostagem);

export default forumRouters;