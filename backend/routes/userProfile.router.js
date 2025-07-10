import express from "express";
import { upload } from '../uploads/upload.js';
import { createUserProfile, getUserProfileByOne, updateUserProfile, deleteUserProfile } from "../controllers/userProfile.controller.js"
import {verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";


const userProfileRouters = express.Router();

userProfileRouters.get('/userProfile/me', verificarToken, getUserProfileByOne);
userProfileRouters.post('/userProfile', verificarToken, upload.single('imagemProfile'), createUserProfile);
userProfileRouters.put('/userProfile/:id', verificarToken, upload.single('imagemProfile'), updateUserProfile);
userProfileRouters.delete('/userProfile/:id', verificarAdmin, deleteUserProfile);

export default userProfileRouters;