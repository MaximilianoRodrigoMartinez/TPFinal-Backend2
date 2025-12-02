const userDAO = require("../dao/UserDAO");
const Cart = require("../models/Cart");
const User = require("../models/User");

class UserRepository {
  async createUser(userData) {
    try {
      const normalizedEmail = userData.email ? userData.email.toLowerCase().trim() : null;

      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        throw new Error("El email ya está registrado");
      }

      const newCart = new Cart({ products: [] });
      await newCart.save();

      const user = await userDAO.create({
        ...userData,
        email: normalizedEmail,
        cart: newCart._id,
      });

      const userObject = user.toObject();
      delete userObject.password;
      return userObject;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const normalizedEmail = email ? email.toLowerCase().trim() : null;
      const user = await User.findOne({ email: normalizedEmail });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await userDAO.getById(id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      return user;
    } catch (error) {
      throw error;
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

      const userObject = user.toObject();
      delete userObject.password;
      return userObject;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();
