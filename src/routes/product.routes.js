import { Router } from "express";

import { productDto } from './../dtos/product.dto.js';
import { uploader } from "../middlewares/multer.middleware.js";
import { productController } from "../controllers/product.controller.js";
import { validate, validateId } from "../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../utils/jwt.js";

export const productRouter = Router();

productRouter.get("/:id", validateId, productController.getProductById);

productRouter.post("/", authenticate, authorize(["admin"]), uploader.single("image"), validate(productDto), productController.createProduct);

productRouter.put("/:id", authenticate, authorize(["admin"]), validateId, productController.updateProduct);

productRouter.delete("/:id", authenticate, authorize(["admin"]), validateId, productController.deleteProduct);
