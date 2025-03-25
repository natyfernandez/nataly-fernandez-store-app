import jwt from "jsonwebtoken";
import { CONFIG } from "../config/config.js";

export const authenticateMiddleware = (req, res, next) => {
    const token = req.cookies?.jwt;

    if (!token) return res.redirect("/users/login");

    try {
        req.user = jwt.verify(token, CONFIG.SECRET_KEY);
        next();
    } catch {
        res.redirect("/users/login");
    }
};