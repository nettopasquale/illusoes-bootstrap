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
forumRouters.get('/forums', buscarTopicos);

//Tópicos
forumRouters.post('/forums', verificarToken, criarTopico);
forumRouters.put('/forums/:id/trancar', verificarToken, verificarAdmin, trancarTopico);
forumRouters.delete('/forums/:id', verificarToken, verificarAdmin, excluirTopico);

//Postagens
forumRouters.post('/forums/:topicoId/responder', verificarToken, responderTopico);
forumRouters.put('/postagens/:id', verificarToken, editarPostagem);
forumRouters.delete('/postagens/:id', verificarToken, excluirPostagem);

export default forumRouters;