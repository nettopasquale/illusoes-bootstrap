import jwt from "jsonwebtoken";
const key = process.env.MONGO_URI;

export default function verificarToken(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) return res.status(403).json({ message: "Token não fornecido" });

    const decoded = jwt.verify(token, key);
    if (typeof decoded === "object" && "id" in decoded) {
        req.usuarioId = decoded.id;
        next();
    } else {
        res.status(401).json({ message: "Token inválido"})
    }

}