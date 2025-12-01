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
        required: true,
        default: [''],
    },
},
    {
        timestamps: true
    });

const Tag = mongoose.model('Tag', TagSchema);

export default Tag;