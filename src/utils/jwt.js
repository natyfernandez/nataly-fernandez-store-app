import jwt from "jsonwebtoken";
import { CONFIG } from "../config/config.js";

export function generateToken(payload) {
    const token = jwt.sign(payload, CONFIG.JWT_SECRET, { expiresIn: '1d' });
    return token;
}

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
        return decoded;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new Error("Token expirado");
        }
        throw new Error(`⛔ : ${error}`);
    }
}

export function authenticate(req, res, next) {
    const token = req.cookies.jwt; 

    if (!token) {
        return res.status(401).json({
            error: "Token no proporcionado",
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.message === "Token expirado") {
            res.status(401).json({
                error: "Sesión expirada, inicia sesión de nuevo",
            });
            res.clearCookie("jwt");
            res.redirect("/");
        }

        return res.status(401).json({
            error: "Token inválido",
        });
    }
}
