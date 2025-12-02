const Product = require("../models/Product");
const mongoose = require("mongoose");

class ProductDAO {
  async create(productData) {
    try {
      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Ya existe un producto con ese código");
      }
      throw new Error(`Error creando producto: ${error.message}`);
    }
  }

  async get(options = {}) {
    try {
      const { limit, page, sort, filters } = options;
      const skip = limit && page ? (page - 1) * limit : 0;
      const limitValue = limit ? parseInt(limit) : null;

      const query = Product.find(filters || {});

      if (sort) {
        const sortOptions = {};
        sortOptions[sort.field] = sort.order === "asc" ? 1 : -1;
        query.sort(sortOptions);
      }

      if (limitValue) {
        query.skip(skip).limit(limitValue);
      }

      const products = await query.lean();
      const total = await Product.countDocuments(filters || {});

      return {
        products,
        total,
        page: page || 1,
        limit: limitValue || total,
        totalPages: limitValue ? Math.ceil(total / limitValue) : 1,
      };
    } catch (error) {
      throw new Error(`Error obteniendo productos: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de producto inválido");
      }
      const product = await Product.findById(id).lean();
      return product;
    } catch (error) {
      throw new Error(`Error obteniendo producto por ID: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de producto inválido");
      }
      const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).lean();
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Ya existe otro producto con ese código");
      }
      throw new Error(`Error actualizando producto: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de producto inválido");
      }
      const product = await Product.findByIdAndDelete(id).lean();
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (error) {
      throw new Error(`Error eliminando producto: ${error.message}`);
    }
  }
}

module.exports = new ProductDAO();

