import express from "express";
import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinaryConfig.js";

const imgProfileRouter = express.Router();

//pasta user img Profile
// const storageImgProfile = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "userImgProfile",
//     allowed_formats: ["jpg", "png", "jpeg"],
//   },
// });


// const upload = multer({ storageImgProfile });

// imgProfileRouter.post("/uploads/userProfile", upload.single("userProfile"), (req, res) => {
//   res.status(200).json({
//     message: "Upload successful",
//     imageUrl: req.file.path,
//   });
// });

export default imgProfileRouter;