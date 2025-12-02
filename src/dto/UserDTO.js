class UserDTO {
  static toDTO(user) {
    if (!user) {
      return null;
    }

    return {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      cart: user.cart,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toDTOArray(users) {
    if (!Array.isArray(users)) {
      return [];
    }
    return users.map(user => this.toDTO(user));
  }
}

module.exports = UserDTO;
