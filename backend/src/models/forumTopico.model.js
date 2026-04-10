import mongoose from "mongoose";

const forumTopicoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    conteudo: { type: String, required: true },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoria: {
      type: String,
      enum: [
        "estrategia",
        "iniciante",
        "meta",
        "trocas",
        "regras",
        "torneio",
        "geral",
        "batepapo",
      ],
      default: "geral",
    },
    tags: [{ type: String, trim: true }],
    curtidas: { type: Number, default: 0 },
    curtidoPor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    visualizacoes: { type: Number, default: 0 },
    destaque: { type: Boolean, default: false },
    trancado: { type: Boolean, default: false },
    deletado: { type: Boolean, default: false },
    postagens: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    denuncias: [
      {
        denunciadoPor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ForumPost",
        },
        motivo: { type: String },
        criadoEm: { type: Date, default: Date.now },
      },
    ],
    criadoEm: { type: Date, default: Date.now, required: true },
    dataModificacao: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

forumTopicoSchema.index({ titulo: "text" });
forumTopicoSchema.index({ categoriaId: 1, subforumId: 1, ultimaPostagem:1 });

const ForumTopico = mongoose.model("ForumTopico", forumTopicoSchema);

export default ForumTopico;
