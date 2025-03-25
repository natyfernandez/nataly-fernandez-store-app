import { Router } from "express";

import { authenticate } from "../utils/jwt.js";
import { checkUserCart } from "../middlewares/cart.middleware.js";
import { viewsController } from "../controllers/views.controller.js";

export const viewsRoutes = Router();

viewsRoutes.get("/", viewsController.home);

// Middleware para verificar el carrito del usuario logueado en cada request
viewsRoutes.use(checkUserCart);

viewsRoutes.get(['/login', '/register'], viewsController.session);

viewsRoutes.get("/profile", authenticate, viewsController.profile);
