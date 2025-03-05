import { productsModel } from "../models/products.model.js";
import { Router } from "express";
import { uploader } from './../middlewares/multer.middleware.js';

export const productRouter = Router();

productRouter.get("/", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const products = await productsModel.paginate({}, { page: Number(page), limit: Number(limit) });
        return res.status(200).json(products); // ✅ Solo una respuesta
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los productos' });
    }
});

productRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const products = await productsModel.find(id);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
});

productRouter.post("/", uploader.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Imagen requerida" });
    }
    
    const { title, description, price, stock, category } = req.body;
    const thumbnail = `./assets/images/${req.file.filename}`; 

    try {
        const product = await productsModel.create({ title, description, price, stock, category, thumbnail });
        res.status(201).json(product);
        io.emit("nuevoProducto", product)
    } catch (error) {
        res.status(500).json({ message: "Error al crear un producto"});
    }
});

productRouter.put("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const { title, description, price, stock, category, thumbnail } = req.body;
        const product = await productsModel.findByIdAndUpdate(id, { title, description, price, stock, category, thumbnail });

        if (!product) {
            return res.status(404).json({ message:'Producto no encontrado'});
        }

        res.status(200).json({ message: `Producto actualizado: ${product}` });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar" });
    }
});

productRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await productsModel.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message:'Producto no encontrado'});
        }

        res.status(200).json({ message: `Producto eliminado: ${product}` });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto" });
    }
});