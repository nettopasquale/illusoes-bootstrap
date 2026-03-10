import mongoose from "mongoose";

const ColecaoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  cartas: [{
    nome: { type: String, required: true },
    quantidade: Number,
    imagem: String
  },
    { checklist: { type: Boolean, default: false } },
  ],
  dono: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  capa: { type: String, default: "", required: false },
  
});

const Colecao = mongoose.model("Colecao", ColecaoSchema);


export default Colecao;