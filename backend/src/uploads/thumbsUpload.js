import express from "express";
import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinaryConfig.js";

const thumbsUpload = express.Router();

//pasta thumbs
// const storageThumbs = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "thumbs",
//     allowed_formats: ["jpg", "png", "jpeg"],
//   },
// });


// const upload = multer({ storageThumbs });

// thumbsUpload.post("/uploads/thumbs", upload.single("thumbs"), (req, res) => {
//   res.status(200).json({
//     message: "Upload successful",
//     imageUrl: req.file.path,
//   });
// });

export default thumbsUpload;