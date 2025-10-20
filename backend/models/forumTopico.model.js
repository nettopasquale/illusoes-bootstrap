import mongoose from "mongoose";

const forumTopicoSchema = new mongoose.Schema({
    categoriaId: { type: mongoose.Schema.Types.ObjectId, ref: "ForumCategoria", required: true },
    subForumId: { type: mongoose.Schema.Types.ObjectId, ref: "ForumSubForum", default: null },
    titulo: { type: String, required: true, trim: true },
    criador: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dataCriacao: {type: Date.now()},
    dataModificacao: {type: Date.now()},
    primeiroPostId: { type: mongoose.Schema.Types.ObjectId, ref: "ForumPost", }, // controle de contagem de posts
    visualizacoes: { type: Number, default: 0 },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost' }],
    totalPosts: {type: Number, default: 0},
    ultimoPost: {
        postId: { type: mongoose.Schema.Types.ObjectId, ref: "ForumPost" },
        usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        data: { type: Date }
    },
    status: { type: String, enum: ["ativo", "trancado", "removido"], default: "ativo" }, // útil para exclusão lógica
    fixado: { type: Boolean, default: false }, //opcional
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

forumTopicoSchema.index({ titulo: "text" });
forumTopicoSchema.index({ categoriaId: 1, subforumId: 1, ultimaPostagem:1 });

const ForumTopico = mongoose.model("ForumTopico", forumTopicoSchema);

export default ForumTopico;
