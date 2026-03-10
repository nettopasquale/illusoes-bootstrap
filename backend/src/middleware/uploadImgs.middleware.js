
import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = async(req, res, next)=>{
  try{
    if(req.file){
      const path = req.file.path;
      const img = await cloudinary.uploader.upload(path);
      req.imageUrl = img.secure_url;
      return next();
    }
    return next();
  }catch(error){
    return next(error)
  }
}
