import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import dns from "dns";
import User from "./models/user.model.js"; // ajuste o caminho se necessário

dotenv.config();
// necessário para resolver bug do DNS, a partir do node v24.13.1
dns.setDefaultResultOrder("ipv4first");
dns.setServers(['8.8.8.8', '1.1.1.1']);

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

    const usuario = new User({
      usuario: "UsuarioX",
      email: "usuarioX@site.com",
      senha: hashedPassword,
      tipo: "usuario",
    });

    await usuario.save();
    console.log("Usuário criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
  } finally {
    mongoose.connection.close();
  }
}

createUser();
