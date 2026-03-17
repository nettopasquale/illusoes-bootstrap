import express from "express";
import {
  buscarCartas,
  addCartaColecao,
  deletarCartaColecao,
} from "../controllers/colecaoCarta.controller.js";
import {
  verificarToken,
  verificarAdmin,
} from "../middleware/auth.middleware.js";

const cartasColecaoRouters = express.Router();

cartasColecaoRouters.get("/cartas/busca", buscarCartas);
cartasColecaoRouters.post(
  "/colecoes/:colecaoId/cartas",
  verificarToken,
  addCartaColecao,
);

// cartasColecaoRouters.put(
//   "/colecoes/:colecaoId/cartas",
//   verificarToken,
//   editarColecao,
// );
// cartasColecaoRouters.patch(
//   "/colecoes/:colecaoId/cartas",
//   verificarToken,
//   editarColecao,
// );

cartasColecaoRouters.delete(
  "/colecoes/cartas/:id",
  verificarToken,
  deletarCartaColecao,
);

export default cartasColecaoRouters;
