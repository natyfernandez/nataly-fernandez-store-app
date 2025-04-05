import { ticketService } from "../services/ticket.service.js";
import { cartService } from "../services/cart.service.js";
import { ticketDto } from "../dtos/ticket.dto.js";
import { verifyToken } from "../utils/jwt.js";

class TicketController {
    async getAllTickets(req, res) {
        try {
            const tickets = await ticketService.getAllTickets();
            res.status(200).json({ tickets });
        } catch (error) {
            res.status(500).json({
                error: "Internal server error",
                details: error.message,
            });
        }
    }

    async getTicketById(req, res) {
        try {
            const { id } = req.params;
            const ticket = await ticketService.getTicketById(id);

            if (!ticket) {
                return res.status(404).json({ error: "Ticket not found" });
            }

            res.status(200).json({ ticket });
        } catch (error) {
            res.status(500).json({
                error: "Internal server error",
                details: error.message,
            });
        }
    }

    async createTicket(req, res) {
        try {
            const token = req.cookies.jwt;
            if (!token) {
                return res.status(401).json({ error: "Unauthorized" });
            }
    
            const decoded = verifyToken(token);
            const { cid } = req.params;
    
            const cart = await cartService.getCartById({ cid });
            if (!cart) {
                return res.status(404).json({ message: "Carrito no encontrado" });
            }
    
            if (cart.products.length === 0) {
                return res.status(400).json({ message: "El carrito está vacío" });
            }
    
            const purchasedItems = [];
            const notPurchasedItems = [];
    
            let totalAmount = 0;
    
            for (const item of cart.products) {
                const product = item.product;
                if (product.stock > 0) {
                    if (product.stock >= item.quantity) {
                        product.stock -= item.quantity;
                        await product.save();
        
                        purchasedItems.push({
                            product: product._id.toString(),
                            quantity: item.quantity
                        });
        
                        totalAmount += product.price * item.quantity;
                    } else {
                        item.quantity -= product.stock;

                        notPurchasedItems.push({
                            product: product._id.toString(),
                            quantity: item.quantity
                        });

                        purchasedItems.push({
                            product: product._id.toString(),
                            quantity: product.stock
                        });

                        product.stock -= product.stock;
                        await product.save();
                    }
                } else {
                    notPurchasedItems.push({
                        product: product._id.toString(),
                        quantity: item.quantity
                    });
                }
            }
    
            if (purchasedItems.length === 0) {
                return res.status(400).json({
                    message: "No se pudieron procesar los productos por falta de stock",
                    notPurchasedItems
                });
            }
    
            const ticket = {
                amount: totalAmount,
                purchaser: decoded.email,
                products: purchasedItems
            };
    
            const { error } = ticketDto.validate(ticket);
            if (error) {
                return res.status(400).json({ details: error.details });
            }
    
            const newTicket = await ticketService.createTicket({ ticket });
    
            await cartService.updateCart({ cid, products: notPurchasedItems });
    
            res.status(201).json({ newTicket, notPurchasedItems });
        } catch (error) {
            res.status(500).json({
                error: "Internal server error",
                details: error.message,
            });
        }
    }    

    async resolve(req, res) {
        try {
            const { id } = req.params;
            const { resolve } = req.body;

            const ticket = await ticketService.getTicketById(id);

            if (!ticket) {
                return res.status(404).json({ error: "Ticket not found" });
            }

            if (ticket.status !== "pending") {
                return res.status(400).json({ error: "Ticket already resolved" });
            }

            if (!["cancelled", "completed"].includes(resolve)) {
                return res.status(400).json({ error: "Invalid resolve value" });
            }

            ticket.status = resolve;

            const updatedTicket = await ticketService.updateTicket(id, ticket);

            res.status(200).json({ ticket: updatedTicket });
        } catch (error) {
            res.status(500).json({
                error: "Internal server error",
                details: error.message,
            });
        }
    }
}

export const ticketController = new TicketController();