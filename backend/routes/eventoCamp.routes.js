import express from "express";
import { upload } from '../uploads/upload.js';
import {
    criarEvento,
    listarEventos,
    listarEventoPorID,
    editarEvento,
    deletarEvento,
    deletarEventosSemCriador,
    deletarTodosEventos
} from "../controllers/eventoCampeonato.controller.js";
import {verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";


const eventoRouters = express.Router();

//filtro por tipo
eventoRouters.get('/eventos/:tipo', listarEventos); //?tipo=artigo ou ?tipo=noticia
eventoRouters.get('/eventos/:tipo/:id', listarEventoPorID);
eventoRouters.post('/eventos', verificarToken, criarEvento);
eventoRouters.put('/eventos/:tipo/:id', verificarToken, editarEvento);
eventoRouters.patch('/eventos/:tipo/:id', verificarToken, upload.single('imagem'), editarEvento);
eventoRouters.delete('/eventos/:tipo/:id', verificarToken, deletarEvento);
eventoRouters.delete('/eventos', verificarToken, verificarAdmin, deletarEventosSemCriador);

export default eventoRouters;