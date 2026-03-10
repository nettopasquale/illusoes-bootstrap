import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/user.model.js"; // ajuste o caminho se necessário

dotenv.config();

//criar usuário comum no backend
async function createUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({ tipo: "usuario" });
    if (existingUser) {
      console.log("Um usuário já existe.");
      return;
    }

    const hashedPassword = await bcrypt.hash("Usuario@123", 10);

    const admin = new User({
      usuario: "UsuarioX",
      email: "usuarioX@site.com",
      senha: hashedPassword,
      tipo: "usuario",
    });

    await admin.save();
    console.log("Usuário criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
  } finally {
    mongoose.connection.close();
  }
}

createUser();
