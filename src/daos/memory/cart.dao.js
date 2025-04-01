import { v4 as uuid } from "uuid";

const CART_EXPIRATION_DAYS = 20;
const carts = [];

export class CartDao {
    async getCartById({ cid }) {
        return carts.find(cart => cart.id === cid);
    }
    
    async getCartByUser({ user }) {
        return carts.find(cart => cart.user === user);
    }
    
    async createCart({ user }) {
        const newCart = {
            id: uuid(),
            user,
            products: [],
            createdAt: new Date()
        };
        carts.push(newCart);
        return newCart;
    }
    
    async createNewCart() {
        const newCart = {
            id: uuid(),
            products: [],
            createdAt: new Date()
        };
        carts.push(newCart);
        return newCart;
    }
    
    async updateCart({ id }) {
        const cart = carts.find(cart => cart.id === id);
        if (!cart) return null;
        cart.products = [];
        return cart;
    }

    // 🛒 Vaciar carritos después de 20 días sin actividad
    async clearExpiredCarts() {
        try {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() - CART_EXPIRATION_DAYS);

            carts.forEach(cart => {
                if (new Date(cart.createdAt) < expirationDate) {
                    cart.products = [];
                }
            });

            console.log("🛒 Carritos vaciados después de 20 días");
        } catch (error) {
            console.error("❌ Error al vaciar carritos:", error.message);
        }
    }
}