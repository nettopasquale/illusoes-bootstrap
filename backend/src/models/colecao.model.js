import mongoose from "mongoose";

const ColecaoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  dono: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  capa: { type: String, default: "", required: false },
  // cartas: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartaColecao" }],
});

const Colecao = mongoose.model("Colecao", ColecaoSchema);

export default Colecao;
