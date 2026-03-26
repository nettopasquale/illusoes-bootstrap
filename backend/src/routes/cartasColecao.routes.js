import express from "express";
import {
  buscarCartas,
  listarCartasDaColecao,
  addCartaColecao,
  deletarCartaColecao,
} from "../controllers/colecaoCarta.controller.js";
import {
  verificarToken,
  verificarAdmin,
} from "../middleware/auth.middleware.js";

const cartasColecaoRouters = express.Router();

//busca cartas da api
cartasColecaoRouters.get("/cartas/busca", 
  verificarToken, 
  buscarCartas);

//lista as cartas da api
cartasColecaoRouters.get("/colecoes/:colecaoId/cartas", 
  verificarToken, 
  listarCartasDaColecao);

// cria a coleção de cartas
cartasColecaoRouters.post(
  "/colecoes/:colecaoId/cartas",
  verificarToken,
  addCartaColecao,
);

// //edita a coleção inteira de cartas
// cartasColecaoRouters.put(
//   "/colecoes/:colecaoId/cartas",
//   verificarToken,
//   editarColecao,
// );

// //muda apenas uma propriedade
// cartasColecaoRouters.patch(
//   "/colecoes/:colecaoId/cartas",
//   verificarToken,
//   editarColecao,
// );

// deleta alguma carta da coleção
cartasColecaoRouters.delete(
  "/colecoes/:colecaoId/cartas",
  verificarToken,
  deletarCartaColecao,
);


//Rotas ADMN
cartasColecaoRouters.delete(
  "/colecoes/:colecaoId/cartas",
  verificarToken,
  deletarCartaColecao,
);

export default cartasColecaoRouters;
