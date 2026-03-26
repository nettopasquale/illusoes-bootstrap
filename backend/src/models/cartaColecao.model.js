import mongoose from "mongoose";

const CartaColecaoSchema = new mongoose.Schema({
  colecaoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Colecao",
    required: true,
  },
  carta: { type: mongoose.Schema.Types.ObjectId, ref: "Carta" },
  quantidade: { type: Number, default: 1 },
  checklist: { type: Boolean, default: false },
});

CartaColecaoSchema.index({
  colecaoId: 1, carta:1
},
{unique: true})

const CartaColecao = mongoose.model("CartaColecao", CartaColecaoSchema);


export default CartaColecao;