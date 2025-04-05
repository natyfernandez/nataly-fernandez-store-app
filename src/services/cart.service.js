import { cartDao } from '../daos/index.dao.js';

export class CartService {
    async getCartById({ cid }) {
        return await cartDao.getCartById({ cid })
    }
    async getCartByUser({ user }) {
        return await cartDao.getCartByUser({ user })
    }
    async createCart({ user }) {
        return await cartDao.createCart({ user })
    }
    async createNewCart() {
        return await cartDao.createNewCart()
    }
    async updateCart({ cid, products }) {
        return await cartDao.updateCart({ cid, products })
    }
}

export const cartService = new CartService();
