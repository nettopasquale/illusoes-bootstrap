import mongoose from "mongoose";

const userProfileModel = new mongoose.Schema({
    nome: {type: String},
    sobreNome: {type: String},
    apelido: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    senha: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tipo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    imagemProfile: { type: String },
    cpf: { type: String },
    endereco: { type: String },
    idade: {type: Number}
    


}, { timestamps: true });

const UserProfile = mongoose.model("User", userProfileModel);


export default UserProfile;