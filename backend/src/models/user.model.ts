import mongoose, {Schema, Document, type InferSchemaType, type HydratedDocument} from "mongoose";

//modelo do Usuário
const userModel = new Schema({
    usuario: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    tipo: {
        type: String, enum: ["admin", "usuario"],
        default: "usuario", required: true
    },
    banido: { type: Boolean, default: false },
    bio: { type: String },
    reputacao:{type: Number}

}, { timestamps: true });

//inferencia de tipagem
export type User = InferSchemaType<typeof userModel>;

//tipo do documento que o mongoose retorna
export type UserDocument = HydratedDocument<User>

const UserModel = mongoose.model("User", userModel);


export default UserModel;