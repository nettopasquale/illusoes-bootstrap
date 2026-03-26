import mongoose from "mongoose";

const CartaSchema = new mongoose.Schema({
  cartaID: { type: String, required: true, unique: true},
  nome: { type: String },
  jogo: {type: String},
  setNome: { type: String },
  raridade: { type: String },
  printagem: { type: String },
  imagem:{type: String},
  donos: {type: Number}
});

const Carta = mongoose.model("Carta", CartaSchema);


export default Carta;