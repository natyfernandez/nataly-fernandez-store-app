import { Router } from "express";
import { productsModel } from "../models/products.model.js";
import { cartsModel } from "../models/carts.model.js";
import { authenticate } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const viewsRoutes = Router();

viewsRoutes.get("/", async (req, res) => {
    const token = req.cookies.jwt; 
    let isSession = false;
    let cartQuantity = 0;

    try {
        let cart = null;

        if (token) {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            isSession = true;

            cart = await cartsModel.findOne({ user: decoded._id });

            if (!cart) {
                cart = await cartsModel.create({ user: decoded.id, products: [] });
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
            products: await productsModel.paginate({}, { page: Number(req.query.page || 1), limit: Number(req.query.limit || 6) }), 
            cartQuantity, 
            title: "Home", 
            homeUrl: "#" 
        });

    } catch (error) {
        console.error("Error al obtener los productos o manejar el carrito:", error);
        return res.status(500).json({
            message: "Error al obtener los productos o manejar el carrito",
            error: error.message
        });
    }
});

// Middleware para verificar el carrito del usuario logueado en cada request
viewsRoutes.use(async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            let cart = await cartsModel.findOne({ user: decoded._id });

            if (!cart) {
                cart = await cartsModel.create({ user: decoded.id, products: [] });
            }

            // Vaciar el carrito si han pasado más de 20 días desde la última actualización
            const lastUpdated = new Date(cart.updatedAt);
            const now = new Date();
            const diffDays = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));

            if (diffDays >= 20) {
                await cartsModel.updateOne({ _id: cart._id }, { products: [] });
            }
        } catch (error) {
            console.error("Error al verificar el token:", error);
        }
    }

    next();
});

// Vistas de login y register
viewsRoutes.get(['/login', '/register'], async (req, res) => {
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
});

// Vista de perfil
viewsRoutes.get("/profile", authenticate, async (req, res) => {
    const token = req.cookies.jwt; 
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    let cart = await cartsModel.findOne({ user: decoded._id });

    if (!cart) {
        cart = await cartsModel.create({ user: decoded.id, products: [] });
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
        user: decoded 
    });
});
