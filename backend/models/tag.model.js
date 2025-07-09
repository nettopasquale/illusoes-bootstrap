import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    tipo: {
        type: String,
        enum: ['noticia', 'artigo', 'evento', 'campeonato'],
        required: true,
    },
},
    {
        timestamps: true
    });

const Tag = mongoose.model('Tag', TagSchema);

export default Tag;