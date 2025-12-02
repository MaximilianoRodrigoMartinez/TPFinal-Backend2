const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");

class TicketDAO {
  async create(ticketData) {
    try {
      const ticket = new Ticket(ticketData);
      await ticket.save();
      return ticket;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("El código del ticket ya existe");
      }
      throw new Error(`Error creando ticket: ${error.message}`);
    }
  }

  async findByCode(code) {
    try {
      if (!code) {
        return null;
      }
      const ticket = await Ticket.findOne({ code: code.toUpperCase() });
      return ticket;
    } catch (error) {
      throw new Error(`Error obteniendo ticket por código: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de ticket inválido");
      }
      const ticket = await Ticket.findById(id).lean();
      return ticket;
    } catch (error) {
      throw new Error(`Error obteniendo ticket por ID: ${error.message}`);
    }
  }

  async findByPurchaser(purchaserEmail) {
    try {
      if (!purchaserEmail) {
        return [];
      }
      const normalizedEmail = purchaserEmail.toLowerCase().trim();
      const tickets = await Ticket.find({ purchaser: normalizedEmail })
        .sort({ purchase_datetime: -1 })
        .lean();
      return tickets;
    } catch (error) {
      throw new Error(`Error obteniendo tickets por comprador: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const { limit, page } = options;
      const skip = limit && page ? (page - 1) * limit : 0;
      const limitValue = limit ? parseInt(limit) : null;

      const query = Ticket.find().sort({ purchase_datetime: -1 });

      if (limitValue) {
        query.skip(skip).limit(limitValue);
      }

      const tickets = await query.lean();
      const total = await Ticket.countDocuments();

      return {
        tickets,
        total,
        page: page || 1,
        limit: limitValue || total,
        totalPages: limitValue ? Math.ceil(total / limitValue) : 1,
      };
    } catch (error) {
      throw new Error(`Error obteniendo tickets: ${error.message}`);
    }
  }
}

module.exports = new TicketDAO();
