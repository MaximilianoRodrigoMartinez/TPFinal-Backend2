const userDAO = require("../dao/UserDAO");
const Cart = require("../models/Cart");

class UserRepository {
  async createUser(userData) {
    try {
      const normalizedEmail = userData.email ? userData.email.toLowerCase().trim() : null;

      const emailExists = await userDAO.emailExists(normalizedEmail);
      if (emailExists) {
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
      return await userDAO.findByEmail(email);
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await userDAO.findById(id);
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

      const user = await userDAO.findByEmail(email);
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
