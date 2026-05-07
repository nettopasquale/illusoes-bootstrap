import express from "express";
import {
  criarConteudo,
  listarConteudos,
  listarConteudoPorID,
  listarDestaques,
  editarConteudo,
  deletarConteudo,
  deletarConteudosSemCriador,
} from "../controllers/conteudo.controller.js";
import {
  verificarToken,
  verificarAdmin,
  verificarBanido,
} from "../middleware/auth.middleware.js";
import thumbsUpload from "../uploads/thumbsUpload.js";

const conteudoRouters = express.Router();

//filtro por tipo
conteudoRouters.get("/conteudos/destaques", listarDestaques);
conteudoRouters.get("/conteudos/:tipo", listarConteudos);
conteudoRouters.get("/conteudos/:tipo/:id", listarConteudoPorID);

conteudoRouters.post(
  "/conteudos/:tipo",
  verificarToken,
  verificarBanido,
  thumbsUpload,
  criarConteudo,
);

conteudoRouters.put(
  "/conteudos/:tipo/:id",
  verificarToken,
  verificarBanido,
  thumbsUpload,
  editarConteudo,
);

conteudoRouters.patch(
  "/conteudos/:tipo/:id",
  verificarToken,
  verificarBanido,
  thumbsUpload,
  editarConteudo,
);

conteudoRouters.delete("/conteudos/:tipo/:id", verificarToken, deletarConteudo);
conteudoRouters.delete(
  "/conteudos",
  verificarToken,
  verificarBanido,
  verificarAdmin,
  deletarConteudosSemCriador,
);

export default conteudoRouters;
