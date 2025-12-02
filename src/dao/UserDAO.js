const User = require("../models/User");
const Cart = require("../models/Cart");
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

  async findByEmail(email) {
    try {
      if (!email) {
        return null;
      }
      const normalizedEmail = email.toLowerCase().trim();
      const user = await User.findOne({ email: normalizedEmail });
      return user;
    } catch (error) {
      throw new Error(`Error obteniendo usuario por email: ${error.message}`);
    }
  }

  async findById(id) {
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

  async findByIdWithPassword(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de usuario inválido");
      }
      const user = await User.findById(id);
      return user;
    } catch (error) {
      throw new Error(`Error obteniendo usuario por ID: ${error.message}`);
    }
  }

  async emailExists(email) {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const user = await User.findOne({ email: normalizedEmail });
      return !!user;
    } catch (error) {
      throw new Error(`Error verificando email: ${error.message}`);
    }
  }
}

module.exports = new UserDAO();
