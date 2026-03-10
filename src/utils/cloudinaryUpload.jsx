import axios from "axios";
const cloudName = import.meta.env.VITE_API_CLOUD_NAME;

const cloudinaryAPI = axios.create({
  baseURL: "https://api.cloudinary.com",
});

export const cloudinaryUpload = async (file, folder)=>{
    try{
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ilm-upload-preset");
        formData.append("folder", folder)
        formData.append("cloud_name", cloudName);
    
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
        // const res = await cloudinaryAPI.post(url, formData, {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // });
        const res = await cloudinaryAPI.post(url, formData);
    
        console.log(res)
        return res.data.secure_url;

    }catch(error){
        console.error("Erro no upload Cloudnary:", error)
        throw error;
    }
}