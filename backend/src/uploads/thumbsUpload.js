import express from "express";
import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinaryConfig.js";

const thumbsUpload = express.Router();

export default thumbsUpload;