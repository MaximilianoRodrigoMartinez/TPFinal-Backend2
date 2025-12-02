const User = require("../models/User");
const mongoose = require("mongoose");

class UserDAO {
  async create(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("El email ya está registrado");
      }
      throw new Error(`Error creando usuario: ${error.message}`);
    }
  }

  async get(options = {}) {
    try {
      const { limit, page } = options;
      const skip = limit && page ? (page - 1) * limit : 0;
      const limitValue = limit ? parseInt(limit) : null;

      const query = User.find().select("-password").sort({ createdAt: -1 });

      if (limitValue) {
        query.skip(skip).limit(limitValue);
      }

      const users = await query.lean();
      const total = await User.countDocuments();

      return {
        users,
        total,
        page: page || 1,
        limit: limitValue || total,
        totalPages: limitValue ? Math.ceil(total / limitValue) : 1,
      };
    } catch (error) {
      throw new Error(`Error obteniendo usuarios: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de usuario inválido");
      }
      const user = await User.findById(id).select("-password").lean();
      return user;
    } catch (error) {
      throw new Error(`Error obteniendo usuario por ID: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de usuario inválido");
      }
      const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
        .select("-password")
        .lean();
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("El email ya está registrado");
      }
      throw new Error(`Error actualizando usuario: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de usuario inválido");
      }
      const user = await User.findByIdAndDelete(id).select("-password").lean();
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      return user;
    } catch (error) {
      throw new Error(`Error eliminando usuario: ${error.message}`);
    }
  }
}

module.exports = new UserDAO();
