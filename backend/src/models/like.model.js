import mongoose from "mongoose";
import { ref } from "yup";

const LikeSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, //permite relacao com conteudos e colecao
    targetTipo: { type: String, enum: ["colecao", "conteudo"], required: true },
  },
  { timestamps: true },
);

//Evitar duplicacao
LikeSchema.index({usuario: 1, targetId: 1, targetTipo:1});

const LikeModel = mongoose.model("Like", LikeSchema);

export default LikeModel;