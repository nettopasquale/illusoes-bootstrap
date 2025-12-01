import express from "express";
import { uploadThumb, uploadMulti } from '../uploads/upload.js';
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
marketplaceRouters.post('/anuncios/:tipo', verificarToken, uploadThumb.single('imagem'), criarAnuncio);
marketplaceRouters.put('/anuncios/:tipo/:id', verificarToken, uploadThumb.single('imagem'), editarAnuncio);
marketplaceRouters.delete('/anuncios/:tipo/:id', verificarToken, deletarAnuncio);

export default marketplaceRouters;