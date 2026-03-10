import mongoose from "mongoose";

const userProfileModel = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true},
    nome: {type: String},
    sobreNome: {type: String},
    imagemProfile: { type: String },
    cpf: { type: String },
    rg: { type: String },
    endereco: { type: String },
    dataNascimento: { type: String },
    telefone: {type: String}
}, { timestamps: true });

const UserProfile = mongoose.model("UserProfile", userProfileModel);


export default UserProfile;