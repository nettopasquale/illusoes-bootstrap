import mongoose from "mongoose";

const anuncioModel = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  tipo: { type: String, enum: ["carta", "deck", "box", "booster", "sleeve", "playmate"], required: true },
  preco: { type: Number, required: true },
  imagem: {type: String, required: true},
  vendedor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  disponivel: { type: Boolean, default: true }
}, { timestamps: true });

const Anuncio = mongoose.model("Anuncio", anuncioModel);


export default Anuncio;