import { Router } from "express";
import { cartsModel } from "../models/carts.model.js";
import { productsModel } from "../models/products.model.js";

export const cartRouter = Router();

cartRouter.get("/", async (req, res) => {    
    const isSession = req.session.user ? true : false
    const cartQuantity = 0;
    const cart = null;
    try {
        res.status(200).render("cart", {
            isSession,
            cartUser: cart,
            cartQuantity,
            title: "Carrito",
            homeUrl: "/",
        });
    } catch (error) {
        res.status(500).json({ message: "Error al visitar el carrito" });
    }
});

cartRouter.get("/:cid", async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(200).render("cart", {
        isSession: false,
        cartUser: cart._id,
        cartQuantity,
        cartItems,
        title: "Carrito",
        homeUrl: "/",
    });
    const { cid } = req.params;

    try {
        const cart = await cartsModel.findOne({ _id: cid }).populate("products.product");

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        let cartQuantity = 0;

        if (cart.products.length > 0) {
            cartQuantity = cart.products.reduce((acc, item) => acc + item.quantity, 0);
        }

        const cartItems = cart.products.map(item => ({
            product: item.product,
            quantity: item.quantity
        }));
        
        return res.status(200).render("cart", {
            isSession: true,
            cartUser: cart._id,
            cartQuantity,
            cartItems,
            title: "Carrito",
            homeUrl: "/",
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el carrito", error: error.message });
    }
});


cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(200).render("cart", {
        isSession: false,
        cartUser: cart._id,
        cartQuantity,
        cartItems,
        title: "Carrito",
        homeUrl: "/",
    });
    const { cid, pid } = req.params;

    try {
        const product = await productsModel.findOne({_id: pid});
        if (!product) {
            return res.status(404).json({ message: "El producto que quieres agregar no existe" });
        }

        const cart = await cartsModel.findOne({_id: cid});
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();

        const updatedCart = await cartsModel.findOne({_id: cid}).populate("products.product");
        const cartQuantity = updatedCart.products.reduce((acc, item) => acc + item.quantity, 0);
        const cartItems = updatedCart.products.map(item => ({
            product: item.product,
            quantity: item.quantity
        }));

        res.status(200).render("cart", {
            isSession: true,
            cartUser: updatedCart._id,
            cartItems,
            cartQuantity, 
            title: "Carrito",
            homeUrl: "/",
        });

    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.status(500).json({ message: "Error al agregar el producto al carrito", error: error.message });
    }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Cantidad inválida" });
    }

    try {
        const product = await productsModel.findOne({_id: pid});
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const cart = await cartsModel.findOne({_id: cid});
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();

        const updatedCart = await cartsModel.findOne({_id: cid}).populate("products.product");

        const cartQuantity = updatedCart.products.reduce((acc, item) => acc + item.quantity, 0);

        res.status(200).render("cart", {
            cartUser: updatedCart._id,
            cartQuantity,
            cartProducts: updatedCart.products.map(item => item.product),
            title: "Carrito",
            homeUrl: "/",
            productsUrl: "/realtimeproducts"
        });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto en el carrito", error: error.message });
    }
});

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
    const isSession = req.session.user ? true : false;
    const { cid, pid } = req.params;

    try {
        const cart = await cartsModel.findOne({ _id: cid });
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);

        if (productIndex === -1) {
            return res.status(404).json({ message: "El producto no está en el carrito" });
        }

        if (cart.products[productIndex].quantity > 1) {
            cart.products[productIndex].quantity -= 1;
        } else {
            cart.products.splice(productIndex, 1);
        }

        await cart.save();

        const updatedCart = await cartsModel.findOne({ _id: cid }).populate("products.product");
        const cartQuantity = updatedCart.products.reduce((acc, item) => acc + item.quantity, 0);
        const cartItems = updatedCart.products.map(item => ({
            product: item.product,
            quantity: item.quantity
        }));

        res.status(200).render("cart", {
            isSession,
            cartUser: updatedCart._id,
            cartItems,
            cartQuantity, 
            title: "Carrito",
            homeUrl: "/",
        });

    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        res.status(500).json({ message: "Error al eliminar el producto del carrito", error: error.message });
    }
});

cartRouter.delete("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartsModel.findOne({
            _id: cid
        });
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        cart.products = [];

        const updatedCart = await cart.save();

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
