import mongoose from "mongoose";

const eventoCampModel = new mongoose.Schema({
    titulo:{type: String, required: true},
    subTitulo:{type: String, required: true},
    conteudo: {type: String, required: true},
    imagem: { type: String },
    criador: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tipo: {type: String, enum:["evento", "campeonato"], default:"evento"},
    dataPublicacao: { type: Date, default: Date.now, required: true },
}, { timestamps: true });

const EventoCamp = mongoose.model("Evento", eventoCampModel);

export default EventoCamp;