const ticketDAO = require("../dao/TicketDAO");
const Ticket = require("../models/Ticket");

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

      if (!ticketData.code) {
        let codeGenerated = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!codeGenerated && attempts < maxAttempts) {
          const timestamp = Date.now().toString(36).toUpperCase();
          const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
          const code = `TKT-${timestamp}-${randomNum}`;

          const existingTicket = await Ticket.findOne({ code });
          
          if (!existingTicket) {
            ticketData.code = code;
            codeGenerated = true;
          }
          
          attempts++;
        }

        if (!codeGenerated) {
          throw new Error("No se pudo generar un código único para el ticket");
        }
      }

      const ticket = await ticketDAO.create(ticketData);
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  async getTicketByCode(code) {
    try {
      const ticket = await Ticket.findOne({ code: code.toUpperCase() });
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  async getTicketById(id) {
    try {
      const ticket = await ticketDAO.getById(id);
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
      const normalizedEmail = purchaserEmail.toLowerCase().trim();
      const tickets = await Ticket.find({ purchaser: normalizedEmail })
        .sort({ purchase_datetime: -1 })
        .lean();
      return tickets;
    } catch (error) {
      throw error;
    }
  }

  async getAllTickets(options = {}) {
    try {
      return await ticketDAO.get(options);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TicketRepository();
