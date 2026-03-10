import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/user.model.js"; // ajuste o caminho se necessário

dotenv.config();

//criar usuário admin no backend
async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ tipo: "admin" });
    if (existingAdmin) {
      console.log("Um administrador já existe.");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = new User({
      usuario: "Admin",
      email: "admin0@site.com",
      senha: hashedPassword,
      tipo: "admin",
    });

    await admin.save();
    console.log("Administrador criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar admin:", error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
