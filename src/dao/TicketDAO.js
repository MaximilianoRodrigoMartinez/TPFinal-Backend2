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

  async get(options = {}) {
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

  async getById(id) {
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

  async update(id, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de ticket inválido");
      }
      const ticket = await Ticket.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).lean();
      if (!ticket) {
        throw new Error("Ticket no encontrado");
      }
      return ticket;
    } catch (error) {
      throw new Error(`Error actualizando ticket: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de ticket inválido");
      }
      const ticket = await Ticket.findByIdAndDelete(id).lean();
      if (!ticket) {
        throw new Error("Ticket no encontrado");
      }
      return ticket;
    } catch (error) {
      throw new Error(`Error eliminando ticket: ${error.message}`);
    }
  }
}

module.exports = new TicketDAO();
