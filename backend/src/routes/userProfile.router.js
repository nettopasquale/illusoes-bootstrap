import express from "express";
import { createUserProfile, getUserProfileByOne, updateUserProfile, deleteUserProfile } from "../controllers/userProfile.controller.js"
import {verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";


const userProfileRouters = express.Router();

userProfileRouters.get('/userProfile/me', verificarToken, getUserProfileByOne);
userProfileRouters.post('/userProfile', verificarToken, createUserProfile);
userProfileRouters.put('/userProfile/:id', verificarToken, updateUserProfile);
userProfileRouters.delete('/userProfile/:id', verificarAdmin, deleteUserProfile);

export default userProfileRouters;