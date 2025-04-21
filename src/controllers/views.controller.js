import { cartService } from './../services/cart.service.js';
import { productService } from "../services/product.service.js";

import { verifyToken } from "../utils/jwt.js";
import { userService } from '../services/user.service.js';

class ViewsController {
    async home(req, res) {
        try {
            const token = req.cookies.jwt;
            let isSession = false;
            let cartQuantity = 0;

            let cart = null;

            if (token) {
                const decoded = verifyToken(token);
                isSession = true;

                cart = await cartService.getCartByUser({ user: decoded._id });

                if (!cart) {
                    cart = await cartService.createCart({ user: decoded._id });
                }

                // Vaciar el carrito si han pasado más de 20 días desde la última actualización
                const lastUpdate = cart.updatedAt || cart.createdAt;
                const twentyDaysAgo = new Date();
                twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

                if (new Date(lastUpdate) < twentyDaysAgo) {
                    cart.products = [];
                    await cart.save();
                }

                if (cart.products.length > 0) {
                    cartQuantity = cart.products.reduce((acc, item) => acc + item.quantity, 0);
                }
            }

            res.status(200).render("home", {
                isSession,
                cartUser: isSession ? cart._id : null,
                products: await productService.getAllProducts({ page: Number(req.query.page || 1), limit: Number(req.query.limit || 6) }),
                cartQuantity,
                title: "Home",
                homeUrl: "#"
            });

        } catch (error) {
            if (error.message === "Token expirado") {
                res.clearCookie("jwt");
            }

            return res.status(500).json({
                message: "Error al obtener los productos o manejar el carrito",
                error: error.message
            });
        }
    }

    async session(req, res) {
        const token = req.cookies.jwt;
        const isSession = token ? true : false;

        res.render(req.path.substring(1), {
            isSession,
            cartUser: null,
            cartQuantity: 0,
            title: req.path === '/login' ? 'Iniciar sesión' : 'Registro',
            homeUrl: "/",
            user: null
        });
    }

    async profile(req, res) {
        const token = req.cookies.jwt;
        const decoded = verifyToken(token);

        let userData = await userService.getUserByEmail({ email: decoded.email });
        let cart = await cartService.getCartByUser({ user: decoded._id });

        if (!cart) {
            cart = await cartService.createCart({ user: decoded._id });
        }

        const cartQuantity = cart.products.length > 0
            ? cart.products.reduce((acc, item) => acc + item.quantity, 0)
            : 0;

        res.render("profile", {
            isSession: true,
            cartUser: cart._id,
            cartQuantity,
            title: "Perfil",
            homeUrl: "/",
            user: userData
        });
    }

    async products(req, res) {
        try {
            const token = req.cookies.jwt;
            if (!token) {
                return res.redirect("/login");
            }

            const decoded = verifyToken(token);
            const userId = decoded.id;

            const userData = await userService.getUserByEmail({ email: decoded.email });
            let cart = await cartService.getCartByUser({ user: userId });

            if (!cart) {
                cart = await cartService.createCart({ user: userId });
            }

            const cartQuantity = cart.products.reduce((acc, item) => acc + item.quantity, 0);

            res.render("addProducts", {
                isSession: true,
                cartUser: cart._id,
                cartQuantity,
                title: "Productos",
                homeUrl: "/",
                user: userData
            });
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                res.clearCookie("jwt");
                return res.redirect("/login");
            }

            return res.status(500).json({
                message: "Error al ingresar al admin de productos",
                error: error.message
            });
        }
    }

}

export const viewsController = new ViewsController();