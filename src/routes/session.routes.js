import { Router } from "express";

import { sessionController } from "../controllers/session.controller.js";

export const sessionRouter = Router();

sessionRouter.post("/register", sessionController.register);

sessionRouter.post("/login", sessionController.login);

sessionRouter.post("/restore-password", sessionController.restorePassword);
sessionRouter.get("/restore-password/:token", sessionController.showChangePasswordForm);

sessionRouter.post("/change-password", sessionController.changePassword);

sessionRouter.get("/logout", sessionController.logout);