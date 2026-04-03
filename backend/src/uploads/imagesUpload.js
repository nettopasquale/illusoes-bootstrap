import express from "express";
import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinaryConfig.js";

const imagesUpload = express.Router();

//pasta imagens
// const storageImgs = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "imgs",
//     allowed_formats: ["jpg", "png", "jpeg"],
//   },
// });

// const upload = multer({ storageImgs });

// imagesUpload.post("/uploads/imgs", upload.single("image"), (req, res) => {
//   res.status(200).json({
//     message: "Upload successful",
//     imageUrl: req.file.path,
//   });
// });

export default imagesUpload;
