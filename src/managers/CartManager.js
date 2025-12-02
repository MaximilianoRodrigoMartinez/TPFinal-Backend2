const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor() {
    this.filePath = path.join(__dirname, '../data/carts.json');
    this.carts = [];
    this.nextId = 1;
    this.initialized = false;
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeFile();
      this.initialized = true;
    }
  }

  async initializeFile() {
    try {
      // Crear directorio data si no existe
      const dataDir = path.dirname(this.filePath);
      await fs.mkdir(dataDir, { recursive: true });
      
      // Verificar si el archivo existe
      try {
        const fileContent = await fs.readFile(this.filePath, 'utf-8');
        this.carts = JSON.parse(fileContent);
        
        // Encontrar el siguiente ID disponible
        if (this.carts.length > 0) {
          this.nextId = Math.max(...this.carts.map(c => c.id)) + 1;
        }
      } catch (error) {
        // Si el archivo no existe, crear uno vacío
        this.carts = [];
        await this.saveToFile();
      }
    } catch (error) {
      console.error('Error inicializando CartManager:', error);
      throw error;
    }
  }

  async saveToFile() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      throw new Error(`Error guardando carritos: ${error.message}`);
    }
  }

  async createCart() {
    await this.ensureInitialized();
    
    const newCart = {
      id: this.nextId++,
      products: []
    };

    this.carts.push(newCart);
    await this.saveToFile();
    
    return newCart;
  }

  async getCartById(id) {
    await this.ensureInitialized();
    
    const cart = this.carts.find(c => c.id === id);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    return cart;
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    await this.ensureInitialized();
    
    const cart = await this.getCartById(cartId);
    
    // Buscar si el producto ya existe en el carrito
    const existingProductIndex = cart.products.findIndex(p => p.product === productId);
    
    if (existingProductIndex !== -1) {
      // Si el producto ya existe, incrementar la cantidad
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Si es un producto nuevo, agregarlo al carrito
      cart.products.push({
        product: productId,
        quantity: quantity
      });
    }

    await this.saveToFile();
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    await this.ensureInitialized();
    
    const cart = await this.getCartById(cartId);
    const productIndex = cart.products.findIndex(p => p.product === productId);
    
    if (productIndex === -1) {
      throw new Error('Producto no encontrado en el carrito');
    }

    cart.products.splice(productIndex, 1);
    await this.saveToFile();
    
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    await this.ensureInitialized();
    
    if (quantity <= 0) {
      return await this.removeProductFromCart(cartId, productId);
    }

    const cart = await this.getCartById(cartId);
    const product = cart.products.find(p => p.product === productId);
    
    if (!product) {
      throw new Error('Producto no encontrado en el carrito');
    }

    product.quantity = quantity;
    await this.saveToFile();
    
    return cart;
  }

  async clearCart(cartId) {
    await this.ensureInitialized();
    
    const cart = await this.getCartById(cartId);
    cart.products = [];
    await this.saveToFile();
    
    return cart;
  }

  async deleteCart(cartId) {
    await this.ensureInitialized();
    
    const cartIndex = this.carts.findIndex(c => c.id === cartId);
    if (cartIndex === -1) {
      throw new Error('Carrito no encontrado');
    }

    const deletedCart = this.carts.splice(cartIndex, 1)[0];
    await this.saveToFile();
    
    return deletedCart;
  }
}

module.exports = CartManager; 