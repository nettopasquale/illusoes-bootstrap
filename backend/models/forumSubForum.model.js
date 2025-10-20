import mongoose from "mongoose";

const forumSubForumSchema = new mongoose.Schema({
    secaoId: { type: mongoose.Schema.Types.ObjectId, ref: "ForumSecao", required: true },
    nome: { type: String, required: true, unique: true },
    descricao: String,
    order: {type: Number, required: true},
});

const forumSubForum = mongoose.model("ForumTopic", forumSubForumSchema);

export default forumSubForum;