import mongoose from "mongoose";

const userProfileModel = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    nome: { type: String },
    sobrenome: { type: String },
    avatar: { type: String },
    dataNascimento: { type: String },
  },
  { timestamps: true },
);

const UserProfile = mongoose.model("UserProfile", userProfileModel);


export default UserProfile;