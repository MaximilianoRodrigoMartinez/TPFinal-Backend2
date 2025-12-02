const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor() {
    this.filePath = path.join(__dirname, '../data/carts.json');
  }

  async saveToFile(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }
}

module.exports = CartManager; 