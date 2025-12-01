import express from "express";
import {
  criarConteudo,
  listarConteudos,
  listarConteudoPorID,
  editarConteudo,
  deletarConteudo,
  deletarConteudosSemCriador,
} from "../controllers/conteudo.controller.js";
import { verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";
import { uploadMulti, uploadThumb } from "../uploads/upload.js";


const conteudoRouters = express.Router();




//filtro por tipo
conteudoRouters.get('/conteudos/:tipo', listarConteudos);
conteudoRouters.get('/conteudos/:tipo/:id', listarConteudoPorID);

conteudoRouters.post('/conteudos/:tipo', verificarToken, uploadThumb.single("thumbs"), criarConteudo);

conteudoRouters.put('/conteudos/:tipo/:id', verificarToken, uploadThumb.single("thumbs"),editarConteudo);


conteudoRouters.patch('/conteudos/:tipo/:id', verificarToken, uploadThumb.single("thumbs"),  editarConteudo);

conteudoRouters.delete('/conteudos/:tipo/:id', verificarToken, deletarConteudo);
conteudoRouters.delete('/conteudos', verificarToken, verificarAdmin, deletarConteudosSemCriador);

export default conteudoRouters;