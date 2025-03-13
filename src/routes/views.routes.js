import { Router } from "express";
import { productsModel } from "../models/products.model.js";
import { cartsModel } from "../models/carts.model.js";

export const viewsRoutes = Router();

viewsRoutes.get("/", async (req, res) => {
    const isSession = req.session.user ? true : false;
    const { page = 1, limit = 6 } = req.query;

    try {
        let cart = null;
        let cartQuantity = 0;

        if (isSession) {
            cart = await cartsModel.findOne({ user: req.session.user._id });

            if (!cart) {
                cart = await cartsModel.create({ user: req.session.user._id, products: [] });
            }

            // Vaciar el carrito si han pasado más de 20 días desde su última actualización
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
            products: await productsModel.paginate({}, { page: Number(page), limit: Number(limit) }), 
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
    if (req.session.user) {
        let cart = await cartsModel.findOne({ user: req.session.user._id });

        if (!cart) {
            cart = await cartsModel.create({ user: req.session.user._id, products: [] });
        }

        // Vaciar el carrito si han pasado más de 20 días desde la última actualización
        const lastUpdated = new Date(cart.updatedAt);
        const now = new Date();
        const diffDays = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));

        if (diffDays >= 20) {
            await cartsModel.updateOne({ _id: cart._id }, { products: [] });
        }
    }
    next();
});

// Aplicación en las vistas de login, register y profile
viewsRoutes.get(['/login', '/register', '/profile'], async (req, res) => {
    const isSession = req.session.user ? true : false;
    if (req.path === '/profile' && !isSession) return res.redirect('/login');

    let cart = null;
    let cartQuantity = 0;
    if (isSession) {
        cart = await cartsModel.findOne({ user: req.session.user._id });

        if (!cart) {
            cart = await cartsModel.create({ user: req.session.user._id, products: [] });
        }

        if (cart.products.length > 0) {
            cartQuantity = cart.products.reduce((acc, item) => acc + item.quantity, 0);
        }
    }

    res.render(req.path.substring(1), { 
        isSession, 
        cartUser: isSession ? cart._id : null, 
        cartQuantity, 
        title: req.path === '/profile' ? 'Perfil' : req.path === '/login' ? 'Iniciar sesión' : 'Registro', 
        homeUrl: "/", 
        user: isSession ? req.session.user : null 
    });
});
