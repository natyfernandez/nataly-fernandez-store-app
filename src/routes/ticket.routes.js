import { Router } from "express";

import { validateId } from "../middlewares/validate.middleware.js";
import { ticketController } from "../controllers/ticket.controller.js";
import { authenticate } from "../utils/jwt.js";

export const ticketRoutes = Router();

ticketRoutes.get("/", authenticate, ticketController.getAllTickets);
ticketRoutes.get("/:id", authenticate, validateId, ticketController.getTicketById);
ticketRoutes.put("/:id/resolve", authenticate, validateId, ticketController.resolve);