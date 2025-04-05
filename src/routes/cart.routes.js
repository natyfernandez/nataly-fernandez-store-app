import { Router } from "express";

import { cartController } from "../controllers/cart.controller.js";
import { validateId } from "../middlewares/validate.middleware.js";
import { ticketController } from "../controllers/ticket.controller.js";
import { authenticate } from "../utils/jwt.js";

export const cartRouter = Router();

cartRouter.get("/", cartController.viewCart);

cartRouter.get("/:cid", validateId, cartController.getCartById);

cartRouter.post("/:cid/purchase", authenticate, validateId, ticketController.createTicket);

cartRouter.post("/:cid/product/:pid", authenticate, validateId, cartController.addToCart);

cartRouter.put("/:cid/products/:pid", authenticate, validateId, cartController.updateCart);

cartRouter.delete("/:cid/product/:pid", authenticate, validateId, cartController.deleteProductInCart);

cartRouter.delete("/:cid", authenticate, validateId, cartController.deleteCart);
