import { v4 as uuid } from "uuid";

const products = [];

export class ProductDao {
    async getAllProducts() {
        return products;
    }

    async getProductById({ pid }) {
        return products.find((product) => product.id === pid);
    }

    async create({ product }) {
        const newProduct = {
            id: uuid(),
            ...product
        };
        products.push(newProduct);
        return newProduct;
    }

    async updateProduct({ id, product }) {
        const index = products.findIndex(prod => prod.id === id);
        if (index === -1) return null;
        
        products[index] = { ...products[index], ...product };
        return products[index];
    }

    async deleteProduct({ id }) {
        const index = products.findIndex(prod => prod.id === id);
        if (index === -1) return null;
        
        return products.splice(index, 1)[0];
    }
}