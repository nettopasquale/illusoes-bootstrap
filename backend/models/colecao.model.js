import mongoose from "mongoose";

const ColecaoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  cartas: [{
    nome: { type: String, required: true },
    quantidade: Number,
    imagem: String
  }],
  dono: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const Colecao = mongoose.model("Colecao", ColecaoSchema);


export default Colecao;