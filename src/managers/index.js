const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');

// Crear instancias singleton
const productManager = new ProductManager();
const cartManager = new CartManager();

module.exports = {
  productManager,
  cartManager
}; 