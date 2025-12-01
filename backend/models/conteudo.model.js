import mongoose from "mongoose";

const conteudoCampModel = new mongoose.Schema({
    titulo: { type: String, required: true },
    subTitulo: { type: String, required: true },
    conteudo: { type: String, required: true },
    thumbs: { type: String, required: false },
    imagens: [{ type: String, default:[""], required: false }],
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tipo: { type: String, enum: ["noticia", "artigo","evento", "campeonato"], default: "noticia" },
    dataPublicacao: { type: Date, default: Date.now, required: true },
    tags: [{type: String, default: [''] }],
    dataEvento: { type: Date, required: false },
    valorEntrada: { type: Number, required: false },

}, { timestamps: true });

const Conteudo = mongoose.model("Conteudo", conteudoCampModel);

export default Conteudo;

