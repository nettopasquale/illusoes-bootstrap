import express from "express";
import {
    criarAnuncio,
    listarAnuncios,
    listarAnuncioPorID,
    editarAnuncio,
    deletarAnuncio
} from "../controllers/anuncio.controller.js";
import {verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";


const anuncioRouters = express.Router();

//filtro por tipo
anuncioRouters.get('/marketplace/anuncios', listarAnuncios); //?tipo=artigo ou ?tipo=noticia
anuncioRouters.get('/marketplace/anuncios/:id', listarAnuncioPorID);
anuncioRouters.post('//marketplace/anuncios', verificarToken, verificarAdmin, criarAnuncio);
anuncioRouters.put('/marketplace/anuncios/:id', verificarToken, verificarAdmin, editarAnuncio);
anuncioRouters.delete('/marketplace/anuncios/:id', verificarToken, verificarAdmin, deletarAnuncio);

export default anuncioRouters;