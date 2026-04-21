import express from "express";
import { createUserProfile, getUserProfileByOne, updateUserProfile, deleteUserProfile } from "../controllers/userProfile.controller.js"
import {verificarToken, verificarAdmin } from "../middleware/auth.middleware.js";


const userProfileRouters = express.Router();

userProfileRouters.get('/userProfile/:id', verificarToken, getUserProfileByOne);
userProfileRouters.put(
  "/userProfile/:id",
  verificarToken,
  updateUserProfile,
);
userProfileRouters.delete(
  "/userProfile/:id",
  verificarAdmin,
  deleteUserProfile,
);

export default userProfileRouters;