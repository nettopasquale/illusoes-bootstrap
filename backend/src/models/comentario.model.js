import mongoose, { mongo } from "mongoose";

const ComentarioSchema = new mongoose.Schema({
    conteudo: {type: String, required: true},
    autor: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    targetId: {type: mongoose.Schema.Types.ObjectId, required: true}, //permite relacao com conteudos e colecao
    targetTipo: {type:String, enum:["colecao", "conteudo"], required: true},
    parentId: {type: mongoose.Schema.Types.ObjectId, ref:"Comentario", default: null},
    curtidas: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}],
    editado: {type:Boolean, default: false},
    criadoEm: {type: Date, default: Date.now}
},
{timestamps: true});

const ComentarioModel = mongoose.model("Comentario", ComentarioSchema);

export default ComentarioModel;