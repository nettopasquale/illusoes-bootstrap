import express from "express";
import {
    criarAnuncio,
    listarAnuncios,
    listarAnuncioPorID,
    editarAnuncio,
    deletarAnuncio
} from "../controllers/anuncio.controller.js";
import {verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";


const marketplaceRouters = express.Router();

//filtro por tipo
marketplaceRouters.get('/anuncios/:tipo', listarAnuncios); //?tipo=artigo ou ?tipo=noticia
marketplaceRouters.get('/anuncios/:tipo/:id', listarAnuncioPorID);
marketplaceRouters.post('/anuncios/:tipo', verificarToken,criarAnuncio);
marketplaceRouters.put('/anuncios/:tipo/:id', verificarToken,editarAnuncio);
marketplaceRouters.delete('/anuncios/:tipo/:id', verificarToken, deletarAnuncio);

export default marketplaceRouters;