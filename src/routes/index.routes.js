import { Router } from "express";

import { apiRoutes } from "./api.routes.js";
import { cartRouter } from "./cart.routes.js";
import { userRouter } from './users.routes.js';
import { viewsRoutes } from './views.routes.js';
import { ticketRoutes } from './ticket.routes.js';
import { authenticate, authorize } from "../utils/jwt.js";
import { productRouter } from './product.routes.js';

export const routes = Router();

routes.use("/", viewsRoutes);
routes.use("/api", apiRoutes);
routes.use("/users", userRouter);
routes.use("/carts", cartRouter);
routes.use("/tickets", ticketRoutes);
routes.use("/products", productRouter);

routes.get("/admin", authenticate, authorize(["admin"]), (req, res) => {
    res.json({ message: 'Ruta de admin' });
});

routes.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});