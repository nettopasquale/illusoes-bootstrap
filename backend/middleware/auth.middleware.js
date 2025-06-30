import jwt from "jsonwebtoken";
const key = process.env.JWT_SECRET;

export function verificarToken(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) return res.status(403).json({ message: "Token não fornecido" });

    try {
        const decoded = jwt.verify(token, key);
        if (typeof decoded === "object" && "id" in decoded) {
            req.usuarioId = decoded.id;
            req.usuarioTipo = decoded.tipo; // salva tipo: "admin" ou "usuario"
            next();
        } else {
            res.status(401).json({ message: "Token inválido" })
        }

    } catch (error) {
        res.status(401).json({ message: "Token inválido ou expirado", error: error.message });
    }



}

export function verificarAdmin(req, res, next) {
  if (req.usuarioTipo !== "admin") {
    return res.status(403).json({ message: "Acesso restrito a administradores" });
  }
  next();
}