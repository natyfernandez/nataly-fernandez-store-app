import { Router } from 'express';

import { userController } from './../controllers/user.controller.js';
import { authenticateMiddleware } from '../middlewares/authenticate.middleware.js';

export const userRouter = Router();

userRouter.get("/login", userController.login)

userRouter.get("/current", authenticateMiddleware, userController.current)

userRouter.get("/logout", userController.logout)