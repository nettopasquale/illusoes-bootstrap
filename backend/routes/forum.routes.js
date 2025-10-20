import express from "express";
import {
    criarCategoria,
    listarCategoria,
    editarCategoria,
    excluirCategoria,
    criarSubforum,
    editarSubforum,
    excluirSubForum
} from "../controllers/forum.controller.js";
import {verificarAdmin } from "../middleware/auth.middleware.js";

const forumRouters = express.Router();


//Categorias
forumRouters.get('/forum/categorias', listarCategoria);
forumRouters.post('/forum/categorias', verificarAdmin, criarCategoria);
forumRouters.put('/forum/categorias/:id', verificarAdmin, editarCategoria);
forumRouters.delete('/forum/categorias/:id', verificarAdmin, excluirCategoria);

//subForums
forumRouters.post('/forum/categorias/:categoriaId/subforums', verificarAdmin, criarSubforum);
forumRouters.put('/forum/subforums/:id', verificarAdmin, editarSubforum);
forumRouters.delete('/forum/subforums/:id', verificarAdmin, excluirSubForum);



export default forumRouters;