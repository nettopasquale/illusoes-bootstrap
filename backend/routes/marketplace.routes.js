import express from "express";
import { upload } from '../uploads/upload.js';
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
marketplaceRouters.get('/marketplace/anuncios', listarAnuncios); //?tipo=artigo ou ?tipo=noticia
marketplaceRouters.get('/marketplace/anuncios/:id', listarAnuncioPorID);
marketplaceRouters.post('/marketplace/anuncios', verificarToken, upload.single('imagem'), criarAnuncio);
marketplaceRouters.put('/marketplace/anuncios/:id', verificarToken, upload.single('imagem'), editarAnuncio);
marketplaceRouters.delete('/marketplace/anuncios/:id', verificarToken, deletarAnuncio);

export default marketplaceRouters;