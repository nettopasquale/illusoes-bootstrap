import mongoose from "mongoose";

const forumPostSchema = new mongoose.Schema({
    topico: { type: mongoose.Schema.Types.ObjectId, ref: "ForumTopico", required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    conteudo: { type: String, required: true },
    dataCriacao: { type: Date, default: Date.now },
    curtidas: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    citacoes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    numeroPostagem: Number,
    editado: {
        data: Date,
        porAdmin: { type: Boolean, default: false }
    },
    status: { type: String, enum: ["ativo", "removido"], default: "ativo" }, // útil para exclusão lógica

});

const ForumPost = mongoose.model("ForumPost", forumPostSchema);

export default ForumPost;
