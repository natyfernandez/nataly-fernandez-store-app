import { isValidObjectId } from "mongoose";

import { cartService } from './../services/cart.service.js';
import { productService } from "../services/product.service.js";

class CartController {
  async viewCart(req, res) {
    try {
      const isSession = req.session.user ? true : false
      const cartQuantity = 0;
      const cart = null;

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
  }

  async getCartById(req, res) {
    try {
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
      const isValidId = isValidObjectId(cid);

      if (!isValidId) {
        return res.status(400).json({ message: "Invalid ID" })
      }
      const cart = await cartService.getCartById({ cid });

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
  }

  async addToCart(req, res) {
    try {
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
      const product = await productService.getProductById({ pid });
      if (!product) {
        return res.status(404).json({ message: "El producto que quieres agregar no existe" });
      }

      const cart = await cartService.getCartById({ cid });
      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }

      const productIndex = cart.products.findIndex(
        item => item.product._id.toString() === pid
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cart.save();

      const updatedCart = await cartService.getCartById({ cid });
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
  }

  async updateCart(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Cantidad inválida" });
    }

    try {
      const product = await productService.getProductById({ pid });
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      const cart = await cartService.getCartById({ cid });
      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }

      const productIndex = cart.products.findIndex(
        item => item.product._id.toString() === pid
      );
      if (productIndex === -1) {
        return res.status(404).json({ message: "Producto no encontrado en el carrito" });
      }

      cart.products[productIndex].quantity = quantity;
      await cart.save();

      const updatedCart = await cartService.getCartById({ cid });

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
  }

  async deleteProductInCart(req, res) {
    try {
      const { cid, pid } = req.params;

      const cart = await cartService.getCartById({ cid });
      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }

      const productIndex = cart.products.findIndex(
        item => item.product._id.toString() === pid
      );

      if (productIndex === -1) {
        return res.status(404).json({ message: "El producto no está en el carrito" });
      }

      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
      } else {
        cart.products.splice(productIndex, 1);
      }

      await cart.save();

      return res.status(200).json({
        message: "Producto eliminado del carrito",
        cart: await cartService.getCartById({ cid }),
      });

    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el producto del carrito", error: error.message });
    }
  }

  async deleteCart(req, res) {
    try {
      const { cid } = req.params;
      const cart = await cartService.getCartById({ cid });
      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }

      cart.products = [];

      const updatedCart = await cart.save();

      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export const cartController = new CartController();
