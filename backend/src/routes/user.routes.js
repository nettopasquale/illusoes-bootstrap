import express from "express";
import {
    createUser,
    getAllUsers,
    getUserByID,
    updateUser,
    deleteUser,
    funcaoProtegida,
    login,
    getUserContent

} from "../controllers/user.controller.js";
import {verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";

const userRouters = express.Router();

userRouters.get('/users', getAllUsers);
userRouters.get('/user/conteudos', verificarToken, getUserContent);
userRouters.get('/users/:id', getUserByID);
userRouters.get("/protected", verificarToken, verificarAdmin, funcaoProtegida);

userRouters.post('/users', createUser);
userRouters.post('/users/login', login);

//proteger rotas de edição e exclusão
userRouters.put('/users/:id', verificarToken, verificarAdmin, updateUser);
userRouters.delete('/users/:id', verificarToken, verificarAdmin, deleteUser);

export default userRouters;