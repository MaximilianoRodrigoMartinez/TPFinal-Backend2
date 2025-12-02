const fs = require('fs').promises;
const path = require('path');

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, '../data/products.json');
    this.products = [];
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
        this.products = JSON.parse(fileContent);
        
        // Encontrar el siguiente ID disponible
        if (this.products.length > 0) {
          this.nextId = Math.max(...this.products.map(p => p.id)) + 1;
        }
      } catch (error) {
        // Si el archivo no existe, crear uno vacío
        this.products = [];
        await this.saveToFile();
      }
    } catch (error) {
      console.error('Error inicializando ProductManager:', error);
      throw error;
    }
  }

  async saveToFile() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2));
    } catch (error) {
      throw new Error(`Error guardando productos: ${error.message}`);
    }
  }

  async getProducts() {
    await this.ensureInitialized();
    return this.products;
  }

  async getProductById(id) {
    await this.ensureInitialized();
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  async addProduct(productData) {
    await this.ensureInitialized();
    
    // Validar que el código no se repita
    const existingProduct = this.products.find(p => p.code === productData.code);
    if (existingProduct) {
      throw new Error('Ya existe un producto con ese código');
    }

    const newProduct = {
      id: this.nextId++,
      ...productData,
      status: productData.status !== undefined ? productData.status : true,
      thumbnails: productData.thumbnails || []
    };

    this.products.push(newProduct);
    await this.saveToFile();
    
    return newProduct;
  }

  async updateProduct(id, updateData) {
    await this.ensureInitialized();
    
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    // Validar que el código no se repita (si se está actualizando)
    if (updateData.code) {
      const existingProduct = this.products.find(p => p.code === updateData.code && p.id !== id);
      if (existingProduct) {
        throw new Error('Ya existe otro producto con ese código');
      }
    }

    // Actualizar el producto
    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updateData
    };

    await this.saveToFile();
    return this.products[productIndex];
  }

  async deleteProduct(id) {
    await this.ensureInitialized();
    
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    const deletedProduct = this.products.splice(productIndex, 1)[0];
    await this.saveToFile();
    
    return deletedProduct;
  }
}

module.exports = ProductManager; 