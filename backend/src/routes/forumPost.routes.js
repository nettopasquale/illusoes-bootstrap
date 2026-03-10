import express from "express";
import {
    criarPost,
    listarPosts,
    editarPost,
    excluirPost,
    curtirPost
    
} from "../controllers/forumPost.controller.js";
import {verificarToken,verificarAdmin } from "../middleware/auth.middleware.js";

const forumPostRouters = express.Router();

//listagem
forumPostRouters.get('/forum/categorias/:categoriasId/topicos/:topicoId/posts', listarPosts);

//criação, edição e exclusão
forumPostRouters.post('/forum/categorias/:categoriasId/topicos/:topicoId/posts', verificarToken, criarPost);
forumPostRouters.put('/forum/topicos/:topicoId/posts/:postsId', verificarToken, editarPost);
forumPostRouters.delete('/forum/topicos/:topicoId/posts/:postsId', verificarToken, excluirPost);

//curtirPost
forumPostRouters.put('/forum/topicos/:topicoId/posts/:postsId/curtir', verificarToken, curtirPost);

export default forumPostRouters;