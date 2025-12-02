const express = require("express");
const passport = require("passport");
const sessionsController = require("../controllers/sessionsController");

const router = express.Router();

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
  sessionsController.register.bind(sessionsController)
);

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
  sessionsController.login.bind(sessionsController)
);

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  sessionsController.current.bind(sessionsController)
);

router.post("/logout", sessionsController.logout.bind(sessionsController));

module.exports = router;
