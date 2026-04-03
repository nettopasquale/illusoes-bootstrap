import express from "express";
import { buscarLikes, toogleLike } from "../controllers/like.controller.js";
import {
  verificarToken,
  verificarAdmin,
} from "../middleware/auth.middleware.js";

const likesRouters = express.Router();

//buscar curtidas
likesRouters.get("/likes/:targetId/:targetTipo", buscarLikes);

likesRouters.post("/likes", verificarToken, toogleLike);

export default likesRouters;