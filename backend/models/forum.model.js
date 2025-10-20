import mongoose from "mongoose";

const forumSchema = new mongoose.Schema({
    categoriaId: [{type: mongoose.Schema.Types.ObjectId, ref: "forumCategoria", required: true}],

});

const Forum = mongoose.model("Forum", forumSchema);

export default Forum;