import { verifyToken } from "../utils/jwt.js";

import { cartService } from "../services/cart.service.js";

export const checkUserCart = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = verifyToken(token);
            let cart = await cartService.getCartByUser({ user: decoded._id });

            if (!cart) {
                cart = await cartService.createCart({ user: decoded._id });
            }

            // Vaciar el carrito si han pasado más de 20 días desde la última actualización
            const lastUpdated = new Date(cart.updatedAt);
            const now = new Date();
            const diffDays = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));

            if (diffDays >= 20) {
                await cartService.updateCart({ id: cart._id });
            }
        } catch (error) {
            console.error("Error al verificar el token:", error);
        }
    }

    next();
};