import mongoose from "mongoose";

const AnexoSchema = new mongoose.Schema({
    url: String,
    filename: String,
    mimeType: String,
    size: Number,
    storageRef: String
}, { _id: false });

const forumPostSchema = new mongoose.Schema(
  {
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conteudo: { type: String, required: true },
    curtidas: { type: Number, default: 0 },
    curtidoPor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    postagemCitacao: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reply",
      default: null,
    },
    conteudoCitacao: { type: String, default: null },
    nomeAutorCitacao: { type: String, default: null },
    deletado: { type: Boolean, default: false },
    denuncias: [
        {
          denunciadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          motivo: { type: String },
          criadoEm: { type: Date, default: Date.now },
        },
      ],
      //respostas aninhadas
      parenteResposta:{
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    anexos: { type: [AnexoSchema], default: [] },
    curtidas: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    visualizacoes: { type: Number, default: 0 },
    editado: { type: Boolean, default: false },
    status: { type: String, enum: ["ativo", "removido"], default: "ativo" }, // útil para exclusão lógica
    dataModificacao: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

forumPostSchema.index({ topicoId: 1, criadoEm: 1, autor: 1 });
forumPostSchema.index({ conteudo: "text" });

const ForumPost = mongoose.model("ForumPost", forumPostSchema);

export default ForumPost;
