import { productDao } from '../daos/index.dao.js';

class ProductService {
    async getAllProducts({ page, limit }) {
        return await productDao.getAllProducts({ page, limit })
    }
    async getProductById({ pid }) {
        return await productDao.getProductById({ pid })
    }
    async create({ product }) {
        return await productDao.create({ product })
    }
    async updateProduct({ id, product }) {
        return await productDao.updateProduct({ id, product })
    }
    async deleteProduct({ id }) {
        return await productDao.deleteProduct({ id })
    }
    async isValidId({ id }) {
        return await productDao.isValidId({ id });
    }
}

export const productService = new ProductService();