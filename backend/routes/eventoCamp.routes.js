import express from "express";
import {
    criarEvento,
    listarEventos,
    listarEventoPorID,
    editarEvento,
    deletarEvento
} from "../controllers/eventoCampeonato.controller.js";
import {verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";


const eventoRouters = express.Router();

//filtro por tipo
eventoRouters.get('/eventos', listarEventos); //?tipo=artigo ou ?tipo=noticia
eventoRouters.get('/eventos/:id', listarEventoPorID);
eventoRouters.post('/eventos', verificarToken, criarEvento);
eventoRouters.put('/eventos/:id', verificarToken, editarEvento);
eventoRouters.delete('/eventos/:id', verificarToken, deletarEvento);

export default eventoRouters;