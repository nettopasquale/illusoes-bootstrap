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
colecaoRouters.get('/colecoes/:id', listarEventoPorID);
colecaoRouters.post('/colecoes', verificarToken, criarColecao);
colecaoRouters.put('/colecoes/:id', verificarToken, editarColecao);
colecaoRouters.patch('/colecoes/:id', verificarToken, editarColecao);
colecaoRouters.delete('/colecoes/:id', verificarToken, deletarColecao);

export default colecaoRouters;