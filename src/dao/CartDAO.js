const Cart = require("../models/Cart");
const mongoose = require("mongoose");

class CartDAO {
  async create(cartData) {
    try {
      const cart = new Cart(cartData);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error creando carrito: ${error.message}`);
    }
  }

  async get(options = {}) {
    try {
      const { limit, page } = options;
      const skip = limit && page ? (page - 1) * limit : 0;
      const limitValue = limit ? parseInt(limit) : null;

      const query = Cart.find().sort({ createdAt: -1 });

      if (limitValue) {
        query.skip(skip).limit(limitValue);
      }

      const carts = await query.lean();
      const total = await Cart.countDocuments();

      return {
        carts,
        total,
        page: page || 1,
        limit: limitValue || total,
        totalPages: limitValue ? Math.ceil(total / limitValue) : 1,
      };
    } catch (error) {
      throw new Error(`Error obteniendo carritos: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de carrito inválido");
      }
      const cart = await Cart.findById(id).lean();
      return cart;
    } catch (error) {
      throw new Error(`Error obteniendo carrito por ID: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de carrito inválido");
      }
      const cart = await Cart.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).lean();
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      return cart;
    } catch (error) {
      throw new Error(`Error actualizando carrito: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de carrito inválido");
      }
      const cart = await Cart.findByIdAndDelete(id).lean();
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      return cart;
    } catch (error) {
      throw new Error(`Error eliminando carrito: ${error.message}`);
    }
  }
}

module.exports = new CartDAO();

