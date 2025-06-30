import express from "express";
import {
    criarColecao,
    listarColecoes,
    listarEventoPorID,
    editarColecao,
    deletarColecao
} from "../controllers/colecao.controller.js";
import {verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";


const colecaoRouters = express.Router();

//filtro por tipo
colecaoRouters.get('/colecoes', listarColecoes); //?tipo=artigo ou ?tipo=noticia
colecaoRouters.get('colecoes/:id', listarEventoPorID);
colecaoRouters.post('/colecoes', verificarToken, verificarAdmin, criarColecao);
colecaoRouters.put('/colecoes/:id', verificarToken, verificarAdmin, editarColecao);
colecaoRouters.delete('/colecoes/:id', verificarToken, verificarAdmin, deletarColecao);

export default colecaoRouters;