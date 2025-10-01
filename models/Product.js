const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  thumbnails: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model("Product", productSchema);