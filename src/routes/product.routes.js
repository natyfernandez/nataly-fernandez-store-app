import { Router } from "express";

import { productController } from "../controllers/product.controller.js";
import { uploader } from "../middlewares/multer.middleware.js"; // Importa el middleware de multer

export const productRouter = Router();

productRouter.get("/", productController.getAllProducts);

productRouter.get("/:id", productController.getProductById);

productRouter.post("/", uploader.single("image"), productController.createProduct);

productRouter.put("/:id", productController.updateProduct);

productRouter.delete("/:id", productController.deleteProduct);
