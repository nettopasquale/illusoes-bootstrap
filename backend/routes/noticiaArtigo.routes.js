import express from "express";
import {
    criarNoticia,
    listarNoticias,
    listarNoticiaPorID,
    editarNoticia,
    deletarNoticia,
    deletarNoticiasSemAutor
} from "../controllers/noticiaArtigo.controller.js";
import {verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";

const noticiaRouters = express.Router();

//filtro por tipo
noticiaRouters.get('/noticias', listarNoticias); //?tipo=artigo ou ?tipo=noticia
noticiaRouters.get('/noticias/:id', listarNoticiaPorID);
noticiaRouters.post('/noticias', verificarToken, criarNoticia);
noticiaRouters.put('/noticias/:id', verificarToken, editarNoticia);
noticiaRouters.delete('/noticias/:id', verificarToken, deletarNoticia);
noticiaRouters.delete('/noticias', verificarToken, deletarNoticiasSemAutor);

export default noticiaRouters;
