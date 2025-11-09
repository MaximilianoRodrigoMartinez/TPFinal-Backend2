const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Por favor ingresa un email válido"]
  },
  age: {
    type: Number,
    required: true,
    min: [0, "La edad debe ser un número positivo"]
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "La contraseña debe tener al menos 6 caracteres"]
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    default: null
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
}, {
  timestamps: true
});

// Middleware para encriptar contraseña antes de guardar
userSchema.pre("save", async function(next) {
  // Solo encriptar si la contraseña fue modificada o es nueva
  if (!this.isModified("password")) {
    return next();
  }
  
  try {
    // Encriptar contraseña usando bcrypt.hashSync
    const saltRounds = 10;
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

