import { Router } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
import { cartsModel } from "../models/carts.model.js"; 
import { hashPassword, verifyPassword } from "../utils/password.utils.js";

export const sessionRouter = Router();
const SECRET_KEY = "s3cr3t"; 
const CART_EXPIRATION_DAYS = 20;

// REGISTRO
sessionRouter.post("/register", async (req, res) => {
    const { first_name, last_name, age, email, password } = req.body;

    if (!first_name || !last_name || !age || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    try {
        const hashedPassword = await hashPassword(password);

        // 🔹 Crear carrito vacío para el usuario
        const newCart = await cartsModel.create({ products: [] });

        const user = await userModel.create({
            first_name,
            last_name,
            age,
            email,
            password: hashedPassword,
            cart: newCart._id, // Asignar carrito al usuario
        });

        res.redirect("/login");
    } catch (error) {
        res.status(500).json({ message: "Error interno", error: error.message });
    }
});

// LOGIN
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
            cart: user.cart, // Asignar carrito del usuario
        };

        await req.session.save();

        const token = jwt.sign(
            {
                id: user._id,
                email,
                role: "user",
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

// VACIAR EL CARRITO CADA 20 DÍAS
const clearExpiredCarts = async () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - CART_EXPIRATION_DAYS);

    try {
        await cartsModel.updateMany({}, { $set: { products: [] } }); // Vaciar carritos sin eliminarlos
        console.log("🛒 Carritos vaciados después de 20 días");
    } catch (error) {
        console.error("❌ Error al vaciar carritos:", error.message);
    }
};

// Ejecutar limpieza de carritos cada 24 horas
setInterval(clearExpiredCarts, 24 * 60 * 60 * 1000);

// LOGOUT
sessionRouter.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Error al cerrar sesión" });
        }
        res.clearCookie("token");
        res.redirect("/");
    });
});