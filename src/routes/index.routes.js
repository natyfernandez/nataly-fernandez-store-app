import { Router } from "express";

import { viewsRoutes } from './views.routes.js';
import { apiRoutes } from "./api.routes.js";
import { cartRouter } from "./cart.routes.js";
import { userRouter } from './users.routes.js';
import { authenticate } from "../utils/jwt.js";

export const routes = Router();

routes.use("/", viewsRoutes);
routes.use("/users", userRouter);
routes.use("/carts", cartRouter);
routes.use("/api", apiRoutes);

routes.get("/admin", authenticate, (req, res) => {
    res.json({ message: 'Ruta de admin' });
});

routes.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});