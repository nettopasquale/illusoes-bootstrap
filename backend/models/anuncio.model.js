import mongoose from "mongoose";

const anuncioModel = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true,},
  tipo: { type: String, enum: ["venda", "troca"], required: true, default: "venda"},
  categoria: { type: String, enum: ["carta", "deck", "box", "booster", "sleeve", "playmate"], required: true, default: "carta" },
  preco: { type: Number, required: true, },
  condicao: {type: String, enum: ["novo", "usado"], required: true, default: "novo"},
  capa: {type: String, required: true},
  imagem: {type: String, required: true },
  vendedor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  disponivel: { type: Boolean, default: true },
  localizacao: {type: String, required: true, default: ""},
  frete: { type: Number, required: false, default: 0 },
  dataExp: { type: Date, required: false },
  inatividade: {type: Boolean, default: false },
}, { timestamps: true });

const Anuncio = mongoose.model("Anuncio", anuncioModel);


export default Anuncio;