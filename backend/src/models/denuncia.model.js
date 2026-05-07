import mongoose from "mongoose";

const DenunciaSchema = new mongoose.Schema(
  {
    // Quem denunciou
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Quem foi denunciado
    denunciado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // A entidade que gerou a denúncia (tópico, post, conteúdo, coleção)
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    targetTipo: {
      type: String,
      enum: ["topico", "postagem", "conteudo", "colecao", "comentario"],
      required: true,
    },

    motivo: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pendente", "aprovada", "rejeitada", "cancelada"],
      default: "pendente",
    },

    // Preenchido pelo admin ao avaliar
    avaliadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    avaliadoEm: {
      type: Date,
      default: null,
    },
    observacaoAdmin: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// Evita que o mesmo usuário denuncie a mesma entidade duas vezes
DenunciaSchema.index(
  { autor: 1, targetId: 1, targetTipo: 1 },
  { unique: true },
);

// Índices para as queries mais comuns no painel admin
DenunciaSchema.index({ status: 1, createdAt: -1 });
DenunciaSchema.index({ denunciado: 1 });

const DenunciaModel = mongoose.model("Denuncia", DenunciaSchema);

export default DenunciaModel;
