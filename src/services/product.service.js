import { productsModel } from './../models/products.model.js';

export class ProductService {
    async getAllProducts({page, limit}){
        return productsModel.paginate({}, { page: Number(page), limit: Number(limit) })
    }
    async getProductById({pid}){
        return productsModel.findById(pid)
    }
    async create ({product}){
        return productsModel.create(product)
    }
    async updateProduct ({id, product}){
        return productsModel.findByIdAndUpdate(id, { product })
    }
    async deleteProduct ({id}){
        return productsModel.findByIdAndDelete(id)
    }
}

export const productService = new ProductService();