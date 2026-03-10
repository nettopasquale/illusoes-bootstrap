import mongoose from "mongoose";

const forumCategoriachema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  descricao: { type: String, required: true, default: "" },
  restrito: { type: Boolean, default: false }, //acesso restrito
  ordem: { type: Number, required: true, default: 0 },
  subforuns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ForumSubForum' }],
  topicos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ForumTopico' }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const forumCategoria = mongoose.model("ForumCategoria", forumCategoriachema);

export default forumCategoria;
