const passport = require("passport");

// Middleware para proteger rutas que requieren autenticación
const authenticate = passport.authenticate("jwt", { session: false });

// Middleware para verificar si el usuario es admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    status: "error",
    error: "Acceso denegado. Se requieren permisos de administrador."
  });
};

module.exports = {
  authenticate,
  isAdmin
};

