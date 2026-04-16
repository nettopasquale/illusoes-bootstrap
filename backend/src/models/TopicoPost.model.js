import mongoose from "mongoose";

// Anexos
const AnexoSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: ["imagem", "video", "link", "arquivo"],
      required: true,
    },
    url: { type: String, required: true },
    nome: { type: String }, // nome original do arquivo
    tamanho: { type: Number }, // bytes
    thumbnail: { type: String }, // URL de thumbnail
  },
  { _id: false },
);

//Postagens
const PostagemSchema = new mongoose.Schema(
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
    editadoEm: { type: Date, default: null },
    editadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
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

//Topico
const TopicoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    conteudo: { type: String, required: true },
    anexos: [AnexoSchema],
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
      required: true,
    },
    tags: [{ type: String, trim: true }],
    curtidas: { type: Number, default: 0 },
    curtidoPor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    visualizacoes: { type: Number, default: 0 },
    postagensContador: { type: Number, default: 0 }, // cache para evitar .length em toda query
    ultimaPostagemEm: { type: Date, default: null },
    ultimaPostagemPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    destaque: { type: Boolean, default: false },
    trancado: { type: Boolean, default: false },
    deletado: { type: Boolean, default: false },
    criadoEm: { type: Date, default: Date.now, required: true },
    dataModificacao: { type: Date, default: Date.now, required: true },
    // Bookmarks do tópico (nível do topico)
    bookmarkedPor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    postagens: [PostagemSchema],
    denuncias: [
      {
        denunciadoPor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        motivo: { type: String },
        criadoEm: { type: Date, default: Date.now },
      },
    ],
    //moderacao
    editadoEm: { type: Date, default: null },
    editadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

//ìndices de performance
TopicoSchema.index({ categoria: 1, criadoEm: -1 });
TopicoSchema.index({ destaque: -1, criadoEm: -1 });
TopicoSchema.index({ bookmarkedPor: 1 });

//Incremento de contagem de Posts
TopicoSchema.methods.publicarPostESalvar = async function (postData) {
  const postNumber = this.postagens.length + 2; // +2: 1 = post de abertura
  this.postagens.push({ ...postData, postNumber });
  this.postagensContador = this.postagens.filter((r) => !r.deletado).length;
  this.ultimaPostagemEm = new Date();
  this.ultimaPostagemPor = postData.autor;

  return this.save();
};

const TopicoPost = mongoose.model("TopicoPost", TopicoSchema);

export default TopicoPost;