import jwt from "jsonwebtoken";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { cartService } from "../services/cart.service.js";
import { userService } from "../services/user.service.js";
import { hashPassword, verifyPassword } from "../utils/password.utils.js";

import { CONFIG } from './../config/config.js';
import { EMAIL_TYPES } from "../common/constants/email-types.js";
import { mailService } from "../services/mail.service.js";

class SessionController {
    async register(req, res) {
        try {
            const { first_name, last_name, age, email, password } = req.body;

            if (!first_name || !last_name || !age || !email || !password) {
                return res.status(400).json({ message: "Todos los campos son requeridos" });
            }

            const hashedPassword = await hashPassword(password);

            const newCart = await cartService.createNewCart();

            const user = await userService.createUser({
                user: {
                    first_name,
                    last_name,
                    age, email,
                    password: hashedPassword,
                    cart: newCart._id,
                },
            });

            await mailService.sendMail({
                to: user.email,
                subject: "Bienvenido a Luxwel!",
                type: EMAIL_TYPES.WELCOME,
            });
            
            res.redirect("/login");
        } catch (error) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y password requeridos" });
        }

        try {
            const user = await userService.getUserByEmail({ email });
            if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

            const isPasswordCorrect = await verifyPassword(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: "Password inválido" });
            }

            // Generar el token JWT
            const token = jwt.sign(
                {
                    id: user._id,
                    email,
                    role: "user",
                },
                CONFIG.SECRET_KEY,
                { expiresIn: "60m" }
            );

            res.cookie("jwt", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
            });

            res.redirect("/profile");
        } catch (error) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    async restorePassword(req, res) {
        try {
            const { email } = req.body;
    
            if (!email) {
                return res.status(400).json({ message: "Debes ingresar un correo electrónico" });
            }
    
            const user = await userService.getUserByEmail({ email });
            if (!user) {
                return res.status(404).json({ message: "No existe un usuario registrado con ese correo" });
            }
    
            const token = generateToken(
                { email: user.email },
                "1h"
            );
    
            const resetLink = `${CONFIG.FRONTEND_URL}/api/sessions/restore-password/${token}`;
    
            await mailService.sendMail({
                to: user.email,
                subject: "Restablece tu contraseña",
                type: EMAIL_TYPES.RESTORE_PASSWORD,
                resetLink,
            });
    
            res.status(200).json({ message: "Se ha enviado un correo con instrucciones para restablecer tu contraseña" });
        } catch (error) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }    

    async showChangePasswordForm(req, res) {
        const { token } = req.params;

        try {
            const decoded = verifyToken(token);
            res.status(200).render("change-password", { 
                token,
                isSession: false,
                cartUser: null,
                cartQuantity: 0,
                title: "Cambiar contraseña",
                homeUrl: CONFIG.FRONTEND_URL,
            });
        } catch (error) {
            res.status(401).render("session-expired", {
                isSession: false,
                cartUser: null,
                cartQuantity: 0,
                title: "Sesión expirada",
                homeUrl: CONFIG.FRONTEND_URL,
            });
        }
    }


    async changePassword(req, res) {
        try {
            const { token, password, confirmPassword } = req.body;
    
            if (!token || !password || !confirmPassword) {
                return res.status(400).json({ message: "Todos los campos son requeridos" });
            }
    
            if (password !== confirmPassword) {
                return res.status(400).json({ message: "Las contraseñas no coinciden" });
            }
    
            let payload;
            try {
                payload = verifyToken(token);
            } catch (err) {
                return res.status(401).json({ message: "Token inválido o expirado" });
            }
    
            const user = await userService.getUserByEmail({ email: payload.email });
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
    
            const hashedPassword = await hashPassword(password);
            await userService.updateUserPassword({ id: user._id, password: hashedPassword });
    
            res.status(200).json({ message: "Contraseña actualizada correctamente" });
        } catch (error) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }
    
    async logout(req, res) {
        res.clearCookie("jwt");
        res.redirect("/");
    }
}

export const sessionController = new SessionController();