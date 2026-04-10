import mongoose from "mongoose";

const AnexoSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "video", "link", "file"],
      required: true,
    },
    url: { type: String, required: true },
    filename: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    thumbnail: { type: String },
    storageRef: { type: String },
  },
  { _id: false },
);

const forumPostSchema = new mongoose.Schema(
  {
    postNumeracao: { type: Number },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conteudo: { type: String, required: true },
    curtidas: { type: Number, default: 0 },
    curtidoPor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarkedPor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    anexos: { type: [AnexoSchema], default: [] },
    curtidas: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    visualizacoes: { type: Number, default: 0 },
    status: { type: String, enum: ["ativo", "removido"], default: "ativo" }, // útil para exclusão lógica
    criadoEm: { type: Date, default: Date.now },
    dataModificacao: { type: Date, default: Date.now, required: true },
    //citacao de posts (quotes)
    postagemCitacao: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    conteudoCitacao: { type: String, default: null },
    nomeAutorCitacao: { type: String, default: null },
    //respostas aninhadas
    parenteResposta: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    //moderacao
    editado: { type: Boolean, default: false },
    deletado: { type: Boolean, default: false },
    denuncias: [
      {
        denunciadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        motivo: { type: String },
        criadoEm: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

//Indices de performance
forumPostSchema.index({ categoria: 1, criadoEm: -1 });
forumPostSchema.index({ destaque: -1, criadoEm: -1 });
forumPostSchema.index({ bookmarkedPor: 1 });


const ForumPost = mongoose.model("ForumPost", forumPostSchema);

export default ForumPost;
