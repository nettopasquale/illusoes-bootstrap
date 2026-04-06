import express from "express";
import { 
    criarComentario,
    listarComentarios,
    toggleLikeComentario,
    deletarComentario
 } from "../controllers/comentario.controller.js";
 import {
   verificarToken,
   verificarAdmin,
 } from "../middleware/auth.middleware.js";

 const comentariosRouters = express.Router();

 comentariosRouters.get('/comentarios/:targetId', listarComentarios);


 comentariosRouters.post('/comentarios', verificarToken, criarComentario);

//  comentariosRouters.post('/:id/likes', verificarToken, toggleLikeComentario);
  comentariosRouters.post(
    "/comentarios/:targetId/likes",
    verificarToken,
    toggleLikeComentario,
  );

 comentariosRouters.delete('/comentarios/:id', verificarToken, deletarComentario);

 export default comentariosRouters;