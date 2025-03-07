import { Router } from "express";
import { productsModel } from "../models/products.model.js";
import { cartsModel } from "../models/carts.model.js";

export const viewsRoutes = Router()

viewsRoutes.get("/", async (req, res) => {
    const isSession = req.session.user ? true : false
    const { page = 1, limit = 6 } = req.query;

    try {
        const cartId = req.cookies.cartId;
        const products = await productsModel.paginate({}, { page: Number(page), limit: Number(limit) });

        let cart;
        let cartQuantity = 0;

        if (cartId) {
            cart = await cartsModel.findOne({ _id: cartId });
            if (cart && cart.products.length > 0) {
                cartQuantity = cart.products.reduce((acc, item) => acc + item.quantity, 0);
            }
        } else {
            cart = await cartsModel.create({});
            res.cookie('cartId', cart._id, { httpOnly: true, secure: false, sameSite: 'lax' });
        }
        res.status(200).render("home", { isSession, cart: cart._id, products, cartQuantity, title: "Home", homeUrl: "#" });
    } catch (error) {
        console.error("Error al obtener los productos o manejar el carrito:", error);
        return res.status(500).json({
            message: "Error al obtener los productos o manejar el carrito",
            error: error.message
        });
    }
});

viewsRoutes.get('/login', async (req, res) => {
    const isSession = req.session.user ? true : false
    if (isSession) return res.redirect('/profile')

    const cartId = req.cookies.cartId;

    let cart;
    let cartQuantity = 0;

    if (cartId) {
        cart = await cartsModel.findOne({ _id: cartId });
        if (cart && cart.products.length > 0) {
            cartQuantity = cart.products.reduce((acc, item) => acc + item.quantity, 0);
        }
    }

    res.render('login', { isSession, cart: cart._id, cartQuantity, title: 'Iniciar sesión', homeUrl: "/" })
})

viewsRoutes.get('/register', async (req, res) => {
    const isSession = req.session.user ? true : false
    if (isSession) return res.redirect('/profile')

    const cartId = req.cookies.cartId;

    let cart;
    let cartQuantity = 0;

    if (cartId) {
        cart = await cartsModel.findOne({ _id: cartId });
        if (cart && cart.products.length > 0) {
            cartQuantity = cart.products.reduce((acc, item) => acc + item.quantity, 0);
        }
    }

    res.render('register', { isSession, cart: cart._id, cartQuantity, title: 'Registro', homeUrl: "/" })
})

viewsRoutes.get('/profile', async (req, res) => {
    const isSession = req.session.user ? true : false
    if (!isSession) return res.redirect('/login')

    const cartId = req.cookies.cartId;

    let cart;
    let cartQuantity = 0;

    if (cartId) {
        cart = await cartsModel.findOne({ _id: cartId });
        if (cart && cart.products.length > 0) {
            cartQuantity = cart.products.reduce((acc, item) => acc + item.quantity, 0);
        }
    }

    res.render('profile', { isSession, cart: cart._id, cartQuantity, title: 'Perfil', homeUrl: "/", user: req.session.user })
})