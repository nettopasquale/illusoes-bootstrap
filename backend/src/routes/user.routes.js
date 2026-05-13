import express from "express";
import {
  createUser,
  getAllUsers,
  getUserByID,
  updateUser,
  deleteUser,
  funcaoProtegida,
  login,
  solicitarRedefinicaoSenha,
  redefinirSenha,
  getUserConteudo,
  getUserColecoes,
  getUserTopicos,
  getUserPosts,
  getUserProfile,
  getUserDenuncias,
  getUserLikes,
  updateUserProfile,
  deleteUserProfile,
  getUserComentarios,
} from "../controllers/user.controller.js";
import {
  verificarToken,
  verificarAdmin,
  verificarBanido,
} from "../middleware/auth.middleware.js";

const userRouters = express.Router();

//-------rotas públicas---------------
userRouters.get('/users', getAllUsers);
userRouters.post('/users', createUser);
userRouters.post('/users/login', login);
userRouters.get('/users/:id', getUserByID);
userRouters.post("/users/solicitar-redefinicao", solicitarRedefinicaoSenha);
userRouters.post("/users/redefinir-senha", redefinirSenha);

//-------rotas usuario logado--------------------------------------
userRouters.get("/userProfile/me", verificarToken, getUserProfile);
userRouters.put("/userProfile/me", verificarToken, updateUserProfile);
userRouters.delete("/userProfile/me",verificarToken,deleteUserProfile);

//-------rotas usuario entidade------------------------------------
userRouters.get("/userProfile/me/conteudos", verificarToken, getUserConteudo);
userRouters.get("/userProfile/me/colecoes", verificarToken, getUserColecoes);
userRouters.get("/userProfile/me/topicos", verificarToken, getUserTopicos);
userRouters.get("/userProfile/me/posts", verificarToken, getUserPosts);
userRouters.get("/userProfile/me/likes", verificarToken, getUserLikes);
userRouters.get(
  "/userProfile/me/comentarios",
  verificarToken,
  getUserComentarios,
);
userRouters.get("/userProfile/me/denuncias", verificarToken, getUserDenuncias);

//ADMIN
userRouters.get("/protected", verificarToken, verificarAdmin, funcaoProtegida);
userRouters.put('/users/:id', verificarToken, verificarAdmin, updateUser);
userRouters.delete('/users/:id', verificarToken, verificarAdmin, deleteUser);

export default userRouters;