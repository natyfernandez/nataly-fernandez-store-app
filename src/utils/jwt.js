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
            res.status(401).render("session-expired", {
                isSession: false,
                cartUser: null,
                cartQuantity: 0,
                title: "Sesión expirada",
                homeUrl: "#"
            });
            res.clearCookie("jwt");
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
        if (error.name === "TokenExpiredError") {
            res.status(401).render("session-expired", {
                isSession: false,
                cartUser: null,
                cartQuantity: 0,
                title: "Sesión expirada",
                homeUrl: "#"
            });
            res.clearCookie("jwt");
        }

        return res.status(401).json({
            error: "Token inválido",
        });
    }
}

export function authorize(roles = []) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "No autenticado" });
        }

        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "No autorizado" });
        }

        next();
    };
}