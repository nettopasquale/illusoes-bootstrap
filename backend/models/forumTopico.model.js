import mongoose from "mongoose";

const forumTopicoSchema = new mongoose.Schema({
    subForumId: {type: mongoose.Schema.Types.ObjectId, ref: "forumSubForum"},
    titulo: { type: String, required: true },
    criador: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    secao: { type: mongoose.Schema.Types.ObjectId, ref: "ForumSecao", required: true },
    dataCriacao: { type: Date, default: Date.now },
    dataModificacao: { type: Date, default: Date.now },
    visualizacoes: { type: Number, default: 0 },
    respostas: { type: Number, default: 0 }, // atualizado com cada post
    ultimaResposta: {
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        data: Date
    },
    conteudo: {type: String, required: true},
    trancado: { type: Boolean, default: false },
    status: { type: String, enum: ["ativo", "removido"], default: "ativo" }, // útil para exclusão lógica

});

const ForumTopico = mongoose.model("ForumTopic", forumTopicoSchema);

export default ForumTopico;
