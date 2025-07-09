import mongoose from "mongoose";

const eventoCampModel = new mongoose.Schema({
    titulo: { type: String, required: true },
    subTitulo: { type: String, required: true },
    conteudo: { type: String, required: true },
    imagem: { type: String },
    criador: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tipo: { type: String, enum: ["evento", "campeonato"], default: "evento" },
    dataPublicacao: { type: Date, default: Date.now, required: true },
    tags: [{ type: String }],
    dataEvento: { type: Date, required: false },
    valorEntrada: { type: Number, required: false },

}, { timestamps: true });

const EventoCamp = mongoose.model("Evento", eventoCampModel);

export default EventoCamp;