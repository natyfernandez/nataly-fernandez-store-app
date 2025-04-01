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
    async updateCart({ id }) {
        return await cartDao.updateCart({ id })
    }
}

export const cartService = new CartService();
