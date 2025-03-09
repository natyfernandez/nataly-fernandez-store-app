import { Router } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
import { hashPassword, verifyPassword } from "../utils/password.utils.js";

export const sessionRouter = Router();
const SECRET_KEY = "s3cr3t"; 

sessionRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email y password requeridos" });
    }

    try {
        const user = await userModel.findOne({ email }).lean();
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const isPasswordCorrect = await verifyPassword(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Password inválido" });
        }

        req.session.user = {
            id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
        };

        await req.session.save(); 

        const token = jwt.sign(
            {
                id: user._id,
                email,
                role: "admin",
            },
            SECRET_KEY,
            { expiresIn: "5m" }
        );

        res.cookie("token", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
        });

        res.redirect("/profile");
    } catch (error) {
        res.status(500).json({ message: "Error interno", error: error.message });
    }
});

sessionRouter.post("/register", async (req, res) => {
    const { first_name, last_name, age, email, password } = req.body;

    if (!first_name || !last_name || !age || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    try {
        const hashedPassword = await hashPassword(password);

        const user = await userModel.create({
            first_name,
            last_name,
            age,
            email,
            password: hashedPassword,
        });

        res.redirect("/login");
    } catch (error) {
        res.status(500).json({ message: "Error interno", error: error.message });
    }
});

sessionRouter.post("/restore-password", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email }).lean();
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const hashedPassword = await hashPassword(password);
        await userModel.updateOne({ _id: user._id }, { password: hashedPassword });

        res.redirect("/login");
    } catch (error) {
        res.status(500).json({ message: "Error interno", error: error.message });
    }
});

sessionRouter.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Error al cerrar sesión" });
        }
        res.clearCookie("token");
        res.redirect("/");
    });
});
