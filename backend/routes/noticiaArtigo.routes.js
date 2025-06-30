import express from "express";
import {
    criarNoticia,
    listarNoticias,
    listarNoticiaPorID,
    editarNoticia,
    deletarNoticia
} from "../controllers/noticiaArtigo.controller.js";
import {verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";

const noticiaRouters = express.Router();

//filtro por tipo
noticiaRouters.get('/noticias', listarNoticias); //?tipo=artigo ou ?tipo=noticia
noticiaRouters.get('/noticias/:id', listarNoticiaPorID);
noticiaRouters.post('/noticias', verificarToken, verificarAdmin, criarNoticia);
noticiaRouters.put('/noticias/:id', verificarToken, verificarAdmin, editarNoticia);
noticiaRouters.delete('/noticias/:id', verificarToken, verificarAdmin, deletarNoticia);

export default noticiaRouters;
