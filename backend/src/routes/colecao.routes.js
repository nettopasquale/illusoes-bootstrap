import express from "express";
import {
    criarColecao,
    listarColecoes,
    listarColecaoPorID,
    editarColecao,
    deletarColecao,
    deletarColecoesSemCriador,
    deletarTodasColecoes
} from "../controllers/colecao.controller.js";
import {verificarToken, verificarAdmin, verificarBanido } from "../middleware/auth.middleware.js";


const colecaoRouters = express.Router();

// rotas get de coleçoes
colecaoRouters.get('/colecoes', listarColecoes);
colecaoRouters.get("/colecoes/:id", listarColecaoPorID);

// rota de criação de coleção
colecaoRouters.post('/colecoes', verificarToken, verificarBanido, criarColecao);

//rotas de edição de coleção
colecaoRouters.put('/colecoes/:id', verificarToken, verificarBanido, editarColecao);
colecaoRouters.patch('/colecoes/:id', verificarToken, verificarBanido, editarColecao);

//rota de exclusão de coleção
colecaoRouters.delete('/colecoes/:id', verificarToken, verificarBanido, deletarColecao);

//rotas admn
// colecaoRouters.delete('/colecoes/:id', verificarAdmin, deletarTodasColecoes);
// colecaoRouters.delete("/colecoes/:id", verificarAdmin, deletarColecoesSemCriador);

export default colecaoRouters;