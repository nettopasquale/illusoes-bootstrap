import mongoose from "mongoose";

const CartaColecaoSchema = new mongoose.Schema({
  colecaoID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Colecao",
    required: true,
  },
  carta: { type: mongoose.Schema.Types.ObjectId, ref: "Carta" },
  //   imagem: { type: String },
  quantidade: { type: Number, default: 1 },
  checklist: { type: Boolean, default: false },
});

const CartaColecao = mongoose.model("CartaColecao", CartaColecaoSchema);


export default CartaColecao;