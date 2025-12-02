const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "El monto debe ser mayor o igual a 0"],
  },
  purchaser: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Por favor ingresa un email válido"],
  },
}, {
  timestamps: true,
});

ticketSchema.pre("save", async function(next) {
  if (this.isNew && !this.code) {
    let codeGenerated = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!codeGenerated && attempts < maxAttempts) {
      const timestamp = Date.now().toString(36).toUpperCase();
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
      const code = `TKT-${timestamp}-${randomNum}`;

      const existingTicket = await mongoose.model("Ticket").findOne({ code });
      
      if (!existingTicket) {
        this.code = code;
        codeGenerated = true;
      }
      
      attempts++;
    }

    if (!codeGenerated) {
      return next(new Error("No se pudo generar un código único para el ticket"));
    }
  }

  if (!this.purchase_datetime) {
    this.purchase_datetime = new Date();
  }

  next();
});

ticketSchema.index({ code: 1 });
ticketSchema.index({ purchaser: 1 });

module.exports = mongoose.model("Ticket", ticketSchema);
