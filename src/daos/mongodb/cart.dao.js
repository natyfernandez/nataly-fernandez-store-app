import { cartsModel } from './../../models/carts.model.js';

const CART_EXPIRATION_DAYS = 20;

export class CartDao {
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
    async updateCart({ cid, products }) {
        if (!cid) {
            throw new Error(`Id del carrito no encontrado`);
        }
        if (!products) {
            return { message: "Productos no encontrados al vaciar carrito" };
        }
        return cartsModel.updateOne({ _id: cid }, { products });
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