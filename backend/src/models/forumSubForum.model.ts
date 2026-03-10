import mongoose from "mongoose";

const forumSubForumSchema = new mongoose.Schema({
    categoriaId: { type: mongoose.Schema.Types.ObjectId, ref: "ForumCategoria", required: true },
    nome: { type: String, required: true },
    descricao: { type: String, required: true, default: "" },
    ordem: { type: Number, required: true, default: 0 },
    restrito: { type: Boolean, default: false }, //acesso restrito
    topicos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ForumTopico' }],
}, {
    timestamps: true
});

forumSubForumSchema.index({ categoriaId: 1, nome: 1 }, { unique: true })

const forumSubForum = mongoose.model("ForumSubForum", forumSubForumSchema);

export default forumSubForum;