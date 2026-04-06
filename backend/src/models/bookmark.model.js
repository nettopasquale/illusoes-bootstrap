import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema(
    {
        usuario:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        targetId: {type: mongoose.Schema.Types.ObjectId, required: true},
        targetTipo:{type: String, enum: ["colecao", "conteudo"], required: true}
    },{timestamps:true},
);

//Evitar duplicação
BookmarkSchema.index({usuario: 1, targetId: 1, targetTipo: 1});

const BookmarkModel = mongoose.model("Bookmark", BookmarkSchema);

export default BookmarkModel;