import mongoose, {Schema} from "mongoose";

// modelo do conteúdo
const conteudoModel = new Schema({
    titulo: { type: String, required: true },
    subTitulo: { type: String, required: true },
    texto: { type: String, required: true },
    thumbs: { type: String, required: false },
    imagens: [{ type: String, default:[""], required: false }],
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tipo: { type: String, enum: ["noticia", "artigo","evento", "campeonato"], default: "noticia" },
    dataPublicacao: { type: Date, default: Date.now, required: true },
    tags: [{type: [String], default: [''] }],
    dataEvento: { type: Date, required: false },
    valorEntrada: { type: Number, required: false },

}, { timestamps: true });

const ConteudoModel = mongoose.model("Conteudo", conteudoModel);

export default ConteudoModel;

