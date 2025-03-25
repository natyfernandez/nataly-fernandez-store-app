import { Router } from "express";

import { sessionController } from "../controllers/session.controller.js";

export const sessionRouter = Router();

sessionRouter.post("/register", sessionController.register);

sessionRouter.post("/login", sessionController.login);

sessionRouter.get("/logout", sessionController.logout);