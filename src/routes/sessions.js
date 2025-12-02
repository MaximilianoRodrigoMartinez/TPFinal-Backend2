const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const UserDTO = require("../dto/UserDTO");

const router = express.Router();

// POST /api/sessions/register - Registrar nuevo usuario usando passport-local
router.post(
  "/register",
  (req, res, next) => {
    passport.authenticate("register", { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          error: err.message,
        });
      }
      if (!user) {
        return res.status(400).json({
          status: "error",
          error: info?.message || "Error al registrar usuario",
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    try {
      const user = req.user;

      // Generar token JWT
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

      // Guardar token SOLO en cookie httpOnly (NO en el body)
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
      });

      res.status(201).json({
        status: "success",
        message: "Usuario registrado exitosamente",
        payload: user, // NO incluir el token aquí
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
  }
);

// POST /api/sessions/login - Login de usuario usando passport-local
router.post(
  "/login",
  (req, res, next) => {
    passport.authenticate("login", { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          error: err.message,
        });
      }
      if (!user) {
        return res.status(401).json({
          status: "error",
          error: info?.message || "Credenciales inválidas",
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    try {
      const user = req.user;

      // Generar token JWT
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

      // Guardar token SOLO en cookie httpOnly (NO en el body)
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
      });

      res.json({
        status: "success",
        message: "Login exitoso",
        payload: user, // NO incluir el token aquí
      });
    } catch (error) {
      res.status(401).json({
        status: "error",
        error: error.message,
      });
    }
  }
);

// GET /api/sessions/current - Obtener usuario actual (usa la estrategia jwt)
// Retorna un DTO del usuario sin información sensible
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      // Convertir el usuario a DTO para evitar enviar información sensible
      const userDTO = UserDTO.toDTO(req.user);
      
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
);

// POST /api/sessions/logout - Logout
router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.json({
    status: "success",
    message: "Logout exitoso",
  });
});

module.exports = router;
