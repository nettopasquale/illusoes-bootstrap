import mongoose from "mongoose";

const noticiaArtigoModel = new mongoose.Schema({
    titulo:{type: String, required: true},
    subTitulo:{type: String, required: true},
    conteudo: {type: String, required: true},
    imagem: { type: String },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tipo: {type: String, enum:["noticia", "artigo"], default:"noticia"},
    dataPublicacao: { type: Date, default: Date.now, required: true },
}, { timestamps: true });

const NoticiaArtigo = mongoose.model("Noticia", noticiaArtigoModel);


export default NoticiaArtigo;