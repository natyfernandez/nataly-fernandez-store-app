import { cartService } from "../services/cart.service.js";
import { productService } from "../services/product.service.js";
import { verifyToken } from "../utils/jwt.js";

class ProductController {
    async getAllProducts(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const products = await productService.getAllProducts({page, limit});
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ message: 'Error al obtener los productos' });
        }
    }

    async getProductById(req, res) {
        try {
            const token = req.cookies.jwt;
            let isSession = false;
            let cartQuantity = 0;
            let cart = null;

            if (token) {
                const decoded = verifyToken(token);
                isSession = true;

                cart = await cartService.getCartByUser({ user: decoded._id });

                cartQuantity = cart.products.length > 0
                    ? cart.products.reduce((acc, item) => acc + item.quantity, 0)
                    : 0;            
            }

            const { pid } = req.params;

            if (!pid) {
                return res.status(404).json({ message: 'ID no proporcionado' });
            }            

            const product = await productService.getProductById({ pid });
            
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }            

            res.status(200).render("single", {
                isSession,
                cartUser: isSession ? cart._id : null,
                cartQuantity,
                title: product.title,
                product,
                homeUrl: "/",
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el producto' });
        }
    }

    async createProduct(req, res) {
        try {
            const { title, description, price, stock, category } = req.body;
            
            let thumbnail;
            
            if (!req.file) {
                thumbnail = './assets/images/default.png';
            } else {
                thumbnail = `./assets/images/${req.file.filename}`;
            }
    
            const product = await productService.create({
                product: {
                    title,
                    description,
                    price,
                    stock,
                    category,
                    thumbnail
                },
            });
    
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ message: "Error al crear un producto" });
        }
    }    

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            
            const { title, description, price, stock, category, thumbnail } = req.body;

            const product = await productService.updateProduct(id, {
                product: {
                    title,
                    description,
                    price,
                    stock,
                    category,
                    thumbnail
                },
            });

            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            res.status(200).json({ message: `Producto actualizado: ${product}` });
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar" });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            
            const product = await productService.deleteProduct(id);

            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            res.status(200).json({ message: `Producto eliminado: ${product}` });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar el producto" });
        }
    }
}

export const productController = new ProductController();