import express from "express";
import { buscarGlobal } from "../controllers/busca.controller.js";
import {
   verificarToken,
   verificarAdmin,
} from "../middleware/auth.middleware.js";

const buscaRouters = express.Router();

buscaRouters.get("/api/busca", buscarGlobal);

export default buscaRouters;