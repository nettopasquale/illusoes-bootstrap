import mongoose from "mongoose";

const forumSecaochema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  descricao: { type: String, required: true},
  restrita: { type: Boolean, default: false }, // para seções tipo 'Anúncios'
  order: {type: Number, required: true},
});

const ForumSecao = mongoose.model("ForumSecao", forumSecaochema);

export default ForumSecao;
