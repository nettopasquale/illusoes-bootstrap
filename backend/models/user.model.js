import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    usuario: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    tipo: {
        type: String, enum: ["admin", "usuario"],
        default: "usuario", required: true
    },
    banido: { type: Boolean, default: false },
    bio: { type: String },
    reputacao:{type: Number}

}, { timestamps: true });

const User = mongoose.model("User", userModel);


export default User;