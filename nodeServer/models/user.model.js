import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    usuario: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model("User", userModel);


export default User;