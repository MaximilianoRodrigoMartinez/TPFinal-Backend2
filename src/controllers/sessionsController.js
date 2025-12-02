const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const UserDTO = require("../dto/UserDTO");

class SessionsController {
  async register(req, res) {
    try {
      const user = req.user;

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || "tu_secret_key_super_segura_cambiar_en_produccion",
        {
          expiresIn: "24h",
        }
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        status: "success",
        message: "Usuario registrado exitosamente",
        payload: user,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const user = req.user;

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || "tu_secret_key_super_segura_cambiar_en_produccion",
        {
          expiresIn: "24h",
        }
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        status: "success",
        message: "Login exitoso",
        payload: user,
      });
    } catch (error) {
      res.status(401).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async current(req, res) {
    try {
      const token = req.cookies?.jwt || req.headers?.authorization?.replace("Bearer ", "");
      const userDTO = UserDTO.toDTO(req.user, token);

      res.json({
        status: "success",
        payload: userDTO,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async logout(req, res) {
    res.clearCookie("jwt");
    res.json({
      status: "success",
      message: "Logout exitoso",
    });
  }
}

module.exports = new SessionsController();

