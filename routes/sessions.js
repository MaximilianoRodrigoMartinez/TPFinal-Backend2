const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

const router = express.Router();

// POST /api/sessions/register - Registrar nuevo usuario
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Validar campos requeridos
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({
        status: "error",
        error: "Todos los campos son requeridos"
      });
    }

    // Validar edad
    if (age < 0 || !Number.isInteger(age)) {
      return res.status(400).json({
        status: "error",
        error: "La edad debe ser un número entero positivo"
      });
    }

    // Validar contraseña
    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        error: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    // Crear usuario
    const user = await userService.createUser({
      first_name,
      last_name,
      email,
      age,
      password
    });

    res.status(201).json({
      status: "success",
      message: "Usuario registrado exitosamente",
      payload: user
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// POST /api/sessions/login - Login de usuario
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        error: "Email y contraseña son requeridos"
      });
    }

    // Validar credenciales
    const user = await userService.validatePassword(email, password);

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || "tu_secret_key_super_segura_cambiar_en_produccion",
      {
        expiresIn: "24h"
      }
    );

    // Guardar token en cookie (opcional)
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    res.json({
      status: "success",
      message: "Login exitoso",
      payload: {
        user: user,
        token: token
      }
    });
  } catch (error) {
    res.status(401).json({
      status: "error",
      error: error.message
    });
  }
});

// GET /api/sessions/current - Obtener usuario actual (requiere autenticación)
router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    try {
      // El usuario está disponible en req.user gracias a Passport
      res.json({
        status: "success",
        payload: req.user
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: error.message
      });
    }
  }
);

// POST /api/sessions/logout - Logout (opcional)
router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.json({
    status: "success",
    message: "Logout exitoso"
  });
});

module.exports = router;

