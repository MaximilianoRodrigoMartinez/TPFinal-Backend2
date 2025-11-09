const User = require("../models/User");
const Cart = require("../models/Cart");
const mongoose = require("mongoose");

class UserService {
  async createUser(userData) {
    try {
      // Normalizar email a minúsculas
      const normalizedEmail = userData.email ? userData.email.toLowerCase().trim() : null;
      
      // Verificar si el email ya existe
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        throw new Error("El email ya está registrado");
      }

      // Crear un carrito para el usuario
      const newCart = new Cart({ products: [] });
      await newCart.save();

      // Crear usuario con el carrito asociado
      const user = new User({
        ...userData,
        email: normalizedEmail,
        cart: newCart._id
      });

      // La contraseña se encripta automáticamente en el pre-save hook
      await user.save();

      // Retornar usuario sin la contraseña
      const userObject = user.toObject();
      delete userObject.password;
      return userObject;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("El email ya está registrado");
      }
      throw new Error(`Error creando usuario: ${error.message}`);
    }
  }

  async getUserByEmail(email) {
    try {
      if (!email) {
        return null;
      }
      const normalizedEmail = email.toLowerCase().trim();
      const user = await User.findOne({ email: normalizedEmail });
      return user;
    } catch (error) {
      throw new Error(`Error obteniendo usuario: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de usuario inválido");
      }

      const user = await User.findById(id).select("-password").lean();
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      return user;
    } catch (error) {
      throw new Error(`Error obteniendo usuario: ${error.message}`);
    }
  }

  async validatePassword(email, password) {
    try {
      if (!email || !password) {
        throw new Error("Email y contraseña son requeridos");
      }

      const user = await this.getUserByEmail(email);
      if (!user) {
        throw new Error("Credenciales inválidas");
      }

      const isPasswordValid = user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error("Credenciales inválidas");
      }

      // Retornar usuario sin la contraseña
      const userObject = user.toObject();
      delete userObject.password;
      return userObject;
    } catch (error) {
      // Re-lanzar el error con el mensaje original
      throw error;
    }
  }
}

module.exports = new UserService();

