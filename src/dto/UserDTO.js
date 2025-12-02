const jwt = require("jsonwebtoken");

class UserDTO {
  static toDTO(user, token = null) {
    if (!user) {
      return null;
    }

    let email = user.email;
    let first_name = user.first_name;
    let last_name = user.last_name;

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "tu_secret_key_super_segura_cambiar_en_produccion"
        );
        if (decoded.email) {
          email = decoded.email.toUpperCase();
        }
        if (user.first_name) {
          first_name = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
        }
        if (user.last_name) {
          last_name = user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1);
        }
      } catch (error) {
      }
    }

    return {
      _id: user._id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      age: user.age,
      cart: user.cart,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toDTOArray(users, token = null) {
    if (!Array.isArray(users)) {
      return [];
    }
    return users.map(user => this.toDTO(user, token));
  }
}

module.exports = UserDTO;
