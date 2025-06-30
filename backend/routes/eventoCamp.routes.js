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
eventoRouters.get('eventos/:id', listarEventoPorID);
eventoRouters.post('/eventos', verificarToken, verificarAdmin, criarEvento);
eventoRouters.put('/eventos/:id', verificarToken, verificarAdmin, editarEvento);
eventoRouters.delete('/eventos/:id', verificarToken, verificarAdmin, deletarEvento);

export default eventoRouters;