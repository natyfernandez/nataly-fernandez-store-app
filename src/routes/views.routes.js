import { Router } from "express";

import { authenticate, authorize } from "../utils/jwt.js";
import { checkUserCart } from "../middlewares/cart.middleware.js";
import { viewsController } from "../controllers/views.controller.js";
import { validateId } from "../middlewares/validate.middleware.js";

export const viewsRoutes = Router();

viewsRoutes.get("/", viewsController.home);

viewsRoutes.use(checkUserCart);

viewsRoutes.get(['/login', '/register'], viewsController.session);

viewsRoutes.get("/profile", authenticate, viewsController.profile);

viewsRoutes.get("/products", authenticate, authorize(["admin"]), viewsController.products);

viewsRoutes.get("/restore-password", viewsController.session);