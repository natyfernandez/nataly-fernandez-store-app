import { cartsModel } from './../models/carts.model.js';

const CART_EXPIRATION_DAYS = 20;

export class CartService {
    async getCartById({ cid }) {
        return cartsModel.findById(cid).populate("products.product");
    }

    async getCartByUser({ user }) {
        return cartsModel.findOne({ user });
    }

    async createCart({ user }) {
        return cartsModel.create({ user, products: [] });
    }

    async createNewCart() {
        return cartsModel.create({ products: [] });
    }

    async updateCart({ id }) {
        return cartsModel.updateOne({ _id: id }, { products: [] });
    }

    // 🛒 Vaciar carritos después de 20 días sin actividad
    async clearExpiredCarts() {
        try {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() - CART_EXPIRATION_DAYS);

            await cartsModel.updateMany({}, { $set: { products: [] } });

            console.log("🛒 Carritos vaciados después de 20 días");
        } catch (error) {
            console.error("❌ Error al vaciar carritos:", error.message);
        }
    }
}

export const cartService = new CartService();
