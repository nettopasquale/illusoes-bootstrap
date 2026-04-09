import mongoose from "mongoose";

const forumSchema = new mongoose.Schema({
  topicos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumTopico",
      required: true,
    },
  ],
});

const Forum = mongoose.model("Forum", forumSchema);

export default Forum;