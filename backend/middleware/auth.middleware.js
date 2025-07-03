import jwt from "jsonwebtoken";
import { key } from "../config.js";

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
            console.log(`usuarioID: ${req.userId} / ${decoded.id}`)
            console.log(`usuarioTipo: ${req.userRole} / ${decoded.role}`)
            next();
        } else {
            res.status(401).json({ message: "Token inválido" })
        }

    } catch (error) {
        console.error("Erro ao verificar token:", error.message);
        res.status(401).json({ message: "Token inválido ou expirado", error: error.message });
    }

}

export function verificarAdmin(req, res, next) {
    if (req.userRole !== "admin") {
        console.log("Acesso negado: não é admin");
        return res.status(403).json({ message: "Acesso restrito a administradores" });
    }
    console.log("Usuário autorizado como admin");
    next();
}