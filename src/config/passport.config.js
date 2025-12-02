const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const userService = require("../services/userService");

// Estrategia Local para registro
passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const { first_name, last_name, age } = req.body;

        // Validar campos requeridos
        if (!first_name || !last_name || !email || !age || !password) {
          return done(null, false, { message: "Todos los campos son requeridos" });
        }

        // Validar edad
        if (age < 0 || !Number.isInteger(age)) {
          return done(null, false, { message: "La edad debe ser un número entero positivo" });
        }

        // Validar contraseña
        if (password.length < 6) {
          return done(null, false, { message: "La contraseña debe tener al menos 6 caracteres" });
        }

        // Crear usuario
        const user = await userService.createUser({
          first_name,
          last_name,
          email,
          age,
          password,
        });

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Estrategia Local para login
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await userService.validatePassword(email, password);
        return done(null, user);
      } catch (error) {
        return done(null, false, { message: error.message });
      }
    }
  )
);

// Configuración de la estrategia JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies.jwt;
      }
      return token;
    },
  ]),
  secretOrKey: process.env.JWT_SECRET || "tu_secret_key_super_segura_cambiar_en_produccion",
};

// Estrategia JWT para autenticación general
passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await userService.getUserById(payload.userId);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Estrategia "current" para obtener usuario actual (trabaja con middleware de autorización)
passport.use(
  "current",
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await userService.getUserById(payload.userId);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
