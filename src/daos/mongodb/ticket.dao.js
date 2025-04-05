import { ticketModel } from "../../models/ticket.model.js";

export class TicketDao {
    async getAllTickets() {
        return await ticketModel.find();
    }

    async getTicketById({ id }) {
        return await ticketModel.findById(id);
    }

    async createTicket({ ticket }) {
        return await ticketModel.create(ticket);
    }

    async updateTicket({ id, ticket }) {
        return await ticketModel.findByIdAndUpdate(id, ticket, { new: true });
    }
}