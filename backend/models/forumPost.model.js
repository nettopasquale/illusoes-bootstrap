import mongoose from "mongoose";

const AnexoSchema = new mongoose.Schema({
    url: String,
    filename: String,
    mimeType: String,
    size: Number,
    storageRef: String
}, { _id: false });

const forumPostSchema = new mongoose.Schema({
    topicoId: { type: mongoose.Schema.Types.ObjectId, ref: "ForumTopico", required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dataModificacao: { type: Date.now() },
    conteudo: { type: String, required: true },
    anexos: { type: [AnexoSchema], default: [] },
    curtidas: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    curtidasTotais: { type: Number, default: 0 },
    visualizacoes: { type: Number, default: 0 },
    editado: {type: Boolean},
    status: { type: String, enum: ["ativo", "removido"], default: "ativo" }, // útil para exclusão lógica

}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

forumPostSchema.index({ topicoId: 1, criadoEm: 1, autor: 1 });
forumPostSchema.index({ conteudo: "text" });

const ForumPost = mongoose.model("ForumPost", forumPostSchema);

export default ForumPost;
