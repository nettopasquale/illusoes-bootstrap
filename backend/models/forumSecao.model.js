import mongoose from "mongoose";

const forumSecaochema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  descricao: String,
  restrita: { type: Boolean, default: false }, // para seções tipo 'Anúncios'
});

const ForumSecao = mongoose.model("ForumSecao", forumSecaochema);

export default ForumSecao;
