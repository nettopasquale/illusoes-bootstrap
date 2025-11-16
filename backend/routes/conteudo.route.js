import express from "express";
import { upload } from '../uploads/upload.js';
import {
    criarConteudo,
    listarConteudos,
    listarConteudoPorID,
    editarConteudo,
    deletarConteudo,
    deletarConteudosSemCriador,
} from "../controllers/conteudo.controller.js";
import {verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";


const conteudoRouters = express.Router();

//filtro por tipo
conteudoRouters.get('/conteudos/:tipo', listarConteudos); 
conteudoRouters.get('/conteudos/:tipo/:id', listarConteudoPorID);

conteudoRouters.post('/conteudos/:tipo', verificarToken, upload.single('imagem'), criarConteudo);
conteudoRouters.put('/conteudos/:tipo/:id', verificarToken,upload.single('imagem'), editarConteudo);
conteudoRouters.patch('/conteudos/:tipo/:id', verificarToken, upload.single('imagem'), editarConteudo);

conteudoRouters.delete('/conteudos/:tipo/:id', verificarToken, deletarConteudo);
conteudoRouters.delete('/conteudos', verificarToken, verificarAdmin, deletarConteudosSemCriador);

export default conteudoRouters;