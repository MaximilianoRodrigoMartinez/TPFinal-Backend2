const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartService {
  async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error('Error creando carrito: ' + error.message);
    }
  }

  async getCartById(id) {
    try {
      const cart = await Cart.findById(id).populate('products.product');
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      return cart;
    } catch (error) {
      throw new Error('Error obteniendo carrito: ' + error.message);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      if (!product.status) {
        throw new Error('Producto no disponible');
      }

      if (product.stock < quantity) {
        throw new Error('Stock insuficiente');
      }

      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      return await this.getCartById(cartId);
    } catch (error) {
      throw new Error('Error agregando producto al carrito: ' + error.message);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId
      );

      await cart.save();
      return await this.getCartById(cartId);
    } catch (error) {
      throw new Error('Error eliminando producto del carrito: ' + error.message);
    }
  }

  async updateCartProducts(cartId, products) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error('Producto ' + item.product + ' no encontrado');
        }
      }

      cart.products = products;
      await cart.save();
      return await this.getCartById(cartId);
    } catch (error) {
      throw new Error('Error actualizando carrito: ' + error.message);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }

      if (quantity === 0) {
        cart.products.splice(productIndex, 1);
      } else {
        cart.products[productIndex].quantity = quantity;
      }

      await cart.save();
      return await this.getCartById(cartId);
    } catch (error) {
      throw new Error('Error actualizando cantidad: ' + error.message);
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products = [];
      await cart.save();
      return await this.getCartById(cartId);
    } catch (error) {
      throw new Error('Error vaciando carrito: ' + error.message);
    }
  }
}

module.exports = new CartService();
