const ticketDAO = require("../dao/TicketDAO");

class TicketRepository {
  async createTicket(ticketData) {
    try {
      if (ticketData.purchaser) {
        ticketData.purchaser = ticketData.purchaser.toLowerCase().trim();
      }

      if (!ticketData.purchase_datetime) {
        ticketData.purchase_datetime = new Date();
      }

      if (typeof ticketData.amount !== "number" || ticketData.amount < 0) {
        throw new Error("El monto debe ser un número mayor o igual a 0");
      }

      const ticket = await ticketDAO.create(ticketData);
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  async getTicketByCode(code) {
    try {
      return await ticketDAO.findByCode(code);
    } catch (error) {
      throw error;
    }
  }

  async getTicketById(id) {
    try {
      const ticket = await ticketDAO.findById(id);
      if (!ticket) {
        throw new Error("Ticket no encontrado");
      }
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  async getTicketsByPurchaser(purchaserEmail) {
    try {
      if (!purchaserEmail) {
        throw new Error("El email del comprador es requerido");
      }
      return await ticketDAO.findByPurchaser(purchaserEmail);
    } catch (error) {
      throw error;
    }
  }

  async getAllTickets(options = {}) {
    try {
      return await ticketDAO.findAll(options);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TicketRepository();
