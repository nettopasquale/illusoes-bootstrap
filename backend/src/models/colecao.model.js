import mongoose from "mongoose";

const ColecaoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    descricao: { type: String, required: true }, 
    dono: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    capa: { type: String, default: "", required: false },
    dataCriacao: {type: Date, default: Date.now},
  },
  { timestamps: true, toJSON:{virtuals: true} },
);

const ColecaoModel = mongoose.model("Colecao", ColecaoSchema);

export default ColecaoModel;
