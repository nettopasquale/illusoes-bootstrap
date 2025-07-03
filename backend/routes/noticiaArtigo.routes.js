import express from "express";
import { upload } from '../uploads/upload.js';

import {
    criarNoticia,
    listarNoticias,
    listarNoticiaPorID,
    editarNoticia,
    deletarNoticia,
    deletarNoticiasSemAutor,
    deletarTodasNoticias
} from "../controllers/noticiaArtigo.controller.js";
import {verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";

const noticiaRouters = express.Router();

//filtro por tipo
noticiaRouters.get('/noticias', listarNoticias); //?tipo=artigo ou ?tipo=noticia
noticiaRouters.get('/noticias/:id', listarNoticiaPorID);
noticiaRouters.post('/noticias', verificarToken, criarNoticia);
noticiaRouters.put('/noticias/:id', verificarToken, editarNoticia);
noticiaRouters.patch('/noticias/:id', verificarToken, upload.single('imagem'), editarNoticia);
noticiaRouters.delete('/noticias/:id', verificarToken, verificarAdmin, deletarNoticia);
noticiaRouters.delete('/noticias', verificarToken, verificarAdmin, deletarNoticiasSemAutor);

export default noticiaRouters;
