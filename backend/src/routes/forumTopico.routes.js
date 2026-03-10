import express from "express";
import {
    criarTopico,
    listarTopicos,
    buscarTopicosPorId,
    editarTopico,
    trancarTopico,
    excluirTopico
} from "../controllers/forumTopico.controller.js";
import {verificarToken,verificarAdmin } from "../middleware/auth.middleware.js";

const forumTopicoRouters = express.Router();

//listagem e busca
forumTopicoRouters.get('/forum/topicos', listarTopicos);
forumTopicoRouters.get('/forum/topicos/:id', buscarTopicosPorId);

//criação e edição
forumTopicoRouters.post('/forum/categorias/:categoriasId/topicos', verificarToken, criarTopico);
forumTopicoRouters.put('/forum/topicos/:id', verificarToken, editarTopico);

//trancar e excluir - Admin
forumTopicoRouters.put('/forum/topicos/:id/trancar', verificarAdmin,trancarTopico);
forumTopicoRouters.delete('/forum/topicos/:id', verificarAdmin, excluirTopico);

export default forumTopicoRouters;