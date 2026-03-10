import jwt from "jsonwebtoken";
import { key } from "../config.js";
import { 
    type Request, 
    type NextFunction } from "express";
import { type TypedResponse } from "../types/http.types.js";

//interfaces
interface JwtPayload{
    id: number
    role: string
}

export interface AuthenticatedRequest extends Request {
  userId?: number;
  userRole?: string;
}

export function verificarToken(
    req: AuthenticatedRequest, 
    res: TypedResponse<{message: string; error?: string}>, 
    next: NextFunction) {
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
        if (typeof decoded === "object" && decoded !== null) {
            const payload = decoded as JwtPayload;
            req.userId = payload.id;
            req.userRole = payload.role; // salva tipo: "admin" ou "usuario"
            console.log(`usuarioID: ${req.userId} / ${payload.id}`)
            console.log(`usuarioTipo: ${req.userRole} / ${payload.role}`)
            next();
        } else {
            res.status(401).json({ message: "Token inválido" })
        }

    } catch (error) {
        if(error instanceof Error){
            console.error("Erro ao verificar token:", error.message);
            res.status(401).json({ message: "Token inválido ou expirado", error: error.message });
        }
    }

}

export function verificarAdmin(
    req: AuthenticatedRequest, 
    res : TypedResponse<{message: string; error?: string}>,
    next: NextFunction) {
    if (req.userRole !== "admin") {
        console.log("Acesso negado: não é admin");
        return res.status(403).json({ message: "Acesso restrito a administradores" });
    }
    console.log("Usuário autorizado como admin");
    next();
}