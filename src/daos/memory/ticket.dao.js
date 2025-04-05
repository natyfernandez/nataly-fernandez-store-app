import { v4 as uuid } from "uuid";

const tickets = [];

export class TicketDao {
    async getAllTickets() {
        return tickets;
    }

    async getTicketById({ id }) {
        return tickets.find(ticket => ticket.id === id);
    }

    async createTicket({ ticket }) {
        const newTicket = {
            id: uuid(),
            ...ticket
        };
        tickets.push(newTicket);
        return newTicket;
    }

    async updateTicket({ id, ticket }) {
        const index = tickets.findIndex(t => t.id === id);
        if (index === -1) return null;

        tickets[index] = { ...tickets[index], ...ticket };
        return tickets[index];
    }

    async deleteTicket({ id }) {
        const index = tickets.findIndex(t => t.id === id);
        if (index === -1) return null;

        return tickets.splice(index, 1)[0];
    }
}
