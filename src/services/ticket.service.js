import { ticketDao } from "../daos/index.dao.js";

class TicketService {
  async getAllTickets() {
    return await ticketDao.getAllTickets();
  }

  async getTicketById({ id }) {
    return await ticketDao.getTicketById({ id });
  }

  async createTicket({ ticket }) {
    return await ticketDao.createTicket({ ticket });
  }

  async updateTicket({ id, ticket }) {
    return await ticketDao.updateTicket({ id, ticket });
  }
}

export const ticketService = new TicketService();
