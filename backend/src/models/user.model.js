import mongoose, {Schema} from "mongoose";

//modelo do Usuário
const userModel = new Schema(
  {
    usuario: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
      match: /^[a-zA-Z0-9_]+$/,
    },
    email: { type: String, required: true, unique: true },
    sobrenome: { type: String },
    avatar: { type: String },
    dataNascimento: { type: String },
    senha: { type: String, required: true },
    tipo: {
      type: String,
      enum: ["admin", "usuario"],
      default: "usuario",
      required: true,
    },
    banido: { type: Boolean, default: false },
    bio: { type: String },
    reputacao: { type: Number },
  },
  { timestamps: true },
);

const UserModel = mongoose.model("User", userModel);


export default UserModel;