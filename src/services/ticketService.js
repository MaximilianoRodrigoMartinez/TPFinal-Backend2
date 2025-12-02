const ticketRepository = require("../repositories/TicketRepository");
const TicketDTO = require("../dto/TicketDTO");

class TicketService {
  async createTicket(ticketData) {
    try {
      return await ticketRepository.createTicket(ticketData);
    } catch (error) {
      throw error;
    }
  }

  async getTicketByCode(code) {
    try {
      return await ticketRepository.getTicketByCode(code);
    } catch (error) {
      throw error;
    }
  }

  async getTicketById(id) {
    try {
      return await ticketRepository.getTicketById(id);
    } catch (error) {
      throw error;
    }
  }

  async getTicketsByPurchaser(purchaserEmail) {
    try {
      return await ticketRepository.getTicketsByPurchaser(purchaserEmail);
    } catch (error) {
      throw error;
    }
  }

  async getAllTickets(options = {}) {
    try {
      return await ticketRepository.getAllTickets(options);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TicketService();
