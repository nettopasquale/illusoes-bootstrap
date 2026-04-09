import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import dns from "dns";
import User from "./models/user.model.js"; // ajuste o caminho se necessário

// necessário para resolver bug do DNS, a partir do node v24.13.1
dns.setDefaultResultOrder("ipv4first");
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

//criar usuário admin no backend
async function createAdmin() {
  const {MONGO_URI, ADMIN_EMAIL, ADMIN_SENHA, ADMIN_USUARIO} = process.env;
  if(!ADMIN_SENHA || !ADMIN_EMAIL || !ADMIN_USUARIO){
    console.error(`Variáveis de admin não definidas!`);
    process.exit(1)
  }

  try {
    await mongoose.connect(MONGO_URI);

    const existingAdmin = await User.findOne({ tipo: "admin" });
    if (existingAdmin) {
      console.log("Um administrador já existe.");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_SENHA, 10);

    const admin = new User({
      usuario: ADMIN_USUARIO,
      email: ADMIN_EMAIL,
      senha: hashedPassword,
      tipo: "admin",
    });

    await admin.save();
    console.log(`Administrador ${ADMIN_USUARIO} criado com sucesso!`);
  } catch (error) {
    console.error("Erro ao criar admin:", error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
