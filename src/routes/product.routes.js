import { Router } from "express";

import { productDto } from './../dtos/product.dto.js';
import { uploader } from "../middlewares/multer.middleware.js";
import { productController } from "../controllers/product.controller.js";
import { validate, validateId } from "../middlewares/validate.middleware.js";

export const productRouter = Router();

productRouter.get("/", productController.getAllProducts);

productRouter.get("/:id", validateId, productController.getProductById);

productRouter.post("/", uploader.single("image"), validate(productDto), productController.createProduct);

productRouter.put("/:id", validateId, productController.updateProduct);

productRouter.delete("/:id", validateId, productController.deleteProduct);
