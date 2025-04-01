import { Router } from "express";

import { cartController } from "../controllers/cart.controller.js";
import { validateId } from "../middlewares/validate.middleware.js";

export const cartRouter = Router();

cartRouter.get("/", cartController.viewCart);

cartRouter.get("/:cid", validateId, cartController.getCartById);

cartRouter.post("/:cid/product/:pid", validateId, cartController.addToCart);

cartRouter.put("/:cid/products/:pid", validateId, cartController.updateCart);

cartRouter.delete("/:cid/product/:pid", validateId, cartController.deleteProductInCart);

cartRouter.delete("/:cid", validateId, cartController.deleteCart);
