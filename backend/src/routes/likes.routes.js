import express from "express";
import { buscarLikes, toogleLike } from "../controllers/like.controller.js";
import {
  verificarToken,
  verificarAdmin,
  verificarBanido,
} from "../middleware/auth.middleware.js";

const likesRouters = express.Router();

//buscar curtidas
likesRouters.post("/likes", verificarToken, verificarBanido, toogleLike);
likesRouters.get("/likes/:targetId/:targetTipo", buscarLikes);


export default likesRouters;