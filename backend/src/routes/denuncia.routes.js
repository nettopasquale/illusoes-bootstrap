import express from "express";
import {
  criarDenuncia,
  cancelarDenuncia,
  listarTodasDenuncias,
  buscarDenunciaPorId,
  avaliarDenuncia,
} from "../controllers/denuncia.controller.js";
import {
  verificarToken,
  verificarAdmin,
  verificarBanido,
} from "../middleware/auth.middleware.js";

const denunciaRoutes = express.Router();

// ── Usuário logado ────────────────────────────────
denunciaRoutes.post("/denuncias", verificarToken, verificarBanido, criarDenuncia);

denunciaRoutes.get(
  "/denuncias/:id",
  verificarToken,
  verificarBanido,
  verificarAdmin,
  buscarDenunciaPorId,
);
denunciaRoutes.delete("/denuncias/:id", verificarToken, cancelarDenuncia);

// ── Admin ─────────────────────────────────────────
denunciaRoutes.get(
  "/denuncias",
  verificarToken,
  verificarAdmin,
  listarTodasDenuncias,
);
denunciaRoutes.patch(
  "/denuncias/:id",
  verificarToken,
  verificarAdmin,
  avaliarDenuncia,
);

export default denunciaRoutes;
