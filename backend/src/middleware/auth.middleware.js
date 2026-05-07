import jwt from "jsonwebtoken";
import { key } from "../configs/jwtConfig.js";
import UserModel from "../models/user.model.js";

export function verificarToken(req, res, next) {
  const tokenHeader = req.headers["authorization"];

  //se token n existir
  if (!tokenHeader) {
    console.log("token ausente");
    return res.status(403).json({ message: "Token não fornecido" });
  }

  const token = tokenHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, key);
    console.log("=== Token decodificado com sucesso ===");
    if (typeof decoded === "object" && "id" in decoded) {
      req.userId = decoded.id;
      req.userRole = decoded.role; // salva tipo: "admin" ou "usuario"
      console.log(`usuarioID: ${req.userId} / ${decoded.id}`);
      console.log(`usuarioTipo: ${req.userRole} / ${decoded.role}`);
      next();
    } else {
      //agora cada com error.response.data?.error === "Token inválido"
      res.status(401).json({ error: "Token inválido" });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao verificar token:", error.message);
      res
        .status(401)
        .json({ error: "Token inválido ou expirado", error: error.message });
    }
  }
}

//verificar se usuario está banido
export async function verificarBanido(req, res, next) {
  try {
    const usuario = await UserModel.findById(req.userId).select("banido");
    if (usuario?.banido) {
      return res.status(403).json({
        error:
          "Sua conta está banida. Entre em contato com os administradores.",
      });
    }
    next();
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
}


export function verificarAdmin(req, res, next) {
  if (req.userRole !== "admin") {
    console.log("Acesso negado: não é admin");
    return res
      .status(403)
      .json({ message: "Acesso restrito a administradores" });
  }
  console.log("Usuário autorizado como admin");
  next();
}
