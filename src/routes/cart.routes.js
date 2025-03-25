import { Router } from "express";

import { cartController } from "../controllers/cart.controller.js";

export const cartRouter = Router();

cartRouter.get("/", cartController.viewCart);

cartRouter.get("/:cid", cartController.getCartById);

cartRouter.post("/:cid/product/:pid", cartController.addToCart);

cartRouter.put("/:cid/products/:pid", cartController.updateCart);

cartRouter.delete("/:cid/product/:pid", cartController.deleteProductInCart);

cartRouter.delete("/:cid", cartController.deleteCart);
