const passport = require("passport");

const authenticate = passport.authenticate("jwt", { session: false });
const authenticateCurrent = passport.authenticate("current", { session: false });

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      error: "No autenticado",
    });
  }

  if (req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    status: "error",
    error: "Acceso denegado. Se requieren permisos de administrador.",
  });
};

const isUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      error: "No autenticado",
    });
  }

  return next();
};

const authenticateAdmin = [authenticateCurrent, isAdmin];
const authenticateUser = [authenticateCurrent, isUser];

module.exports = {
  authenticate,
  isAdmin,
  isUser,
  authenticateAdmin,
  authenticateUser,
};
