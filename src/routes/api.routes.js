import { Router } from 'express';

import { apiUserRouter } from './api.users.routes.js';
import { sessionRouter } from './session.routes.js';
import { productRouter } from "./product.routes.js";

export const apiRoutes = Router();

apiRoutes.use("/users", apiUserRouter);
apiRoutes.use("/sessions", sessionRouter);
//apiRoutes.use("/products", productRouter);