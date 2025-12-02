const userRepository = require("../repositories/UserRepository");

class UserService {
  async createUser(userData) {
    try {
      return await userRepository.createUser(userData);
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      return await userRepository.getUserByEmail(email);
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      return await userRepository.getUserById(id);
    } catch (error) {
      throw error;
    }
  }

  async validatePassword(email, password) {
    try {
      return await userRepository.validatePassword(email, password);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
