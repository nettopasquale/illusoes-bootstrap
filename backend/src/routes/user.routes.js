import express from "express";
import {
  createUser,
  getAllUsers,
  getUserByID,
  updateUser,
  deleteUser,
  funcaoProtegida,
  login,
  getUserConteudo,
  getUserColecoes,
  getUserTopicos,
  getUserPosts,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
} from "../controllers/user.controller.js";
import {verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";

const userRouters = express.Router();

userRouters.get('/users', getAllUsers);
userRouters.get("/user/conteudos", verificarToken, getUserConteudo);
userRouters.get('/user/colecoes', verificarToken, getUserColecoes);
userRouters.get('/user/topicos', verificarToken, getUserTopicos);
userRouters.get('/user/posts', verificarToken, getUserPosts);
userRouters.get('/user/profile', verificarToken, getUserProfile);
userRouters.get('/users/:id', getUserByID);
userRouters.get("/protected", verificarToken, verificarAdmin, funcaoProtegida);

userRouters.post('/users', createUser);
userRouters.post('/users/login', login);

userRouters.put('/user/profile', verificarToken, updateUserProfile);

userRouters.delete('/user/profile', verificarToken, deleteUserProfile);

//proteger rotas de edição e exclusão
userRouters.put('/users/:id', verificarToken, verificarAdmin, updateUser);
userRouters.delete('/users/:id', verificarToken, verificarAdmin, deleteUser);

export default userRouters;