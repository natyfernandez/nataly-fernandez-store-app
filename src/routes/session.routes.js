import { Router } from "express";

import { sessionController } from "../controllers/session.controller.js";

export const sessionRouter = Router();

sessionRouter.post("/register", sessionController.register);

sessionRouter.post("/login", sessionController.login);

sessionRouter.get("/logout", sessionController.logout);

const CART_EXPIRATION_DAYS = 20;

// VACIAR EL CARRITO CADA 20 DÍAS
const clearExpiredCarts = async () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - CART_EXPIRATION_DAYS);

    try {
        await cartsModel.updateMany({}, { $set: { products: [] } });
        console.log("🛒 Carritos vaciados después de 20 días");
    } catch (error) {
        console.error("❌ Error al vaciar carritos:", error.message);
    }
};

// Ejecutar limpieza de carritos cada 24 horas
setInterval(clearExpiredCarts, 24 * 60 * 60 * 1000);