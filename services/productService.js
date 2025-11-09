const Product = require("../models/Product");
const mongoose = require("mongoose");

class ProductService {
  async getProducts(options = {}) {
    const {
      limit = 10,
      page = 1,
      sort,
      query = {}
    } = options;

    // Construir filtros
    const filters = {};
    
    // Filtro por categoría
    if (query.category) {
      filters.category = query.category;
    }
    
    // Filtro por disponibilidad
    if (query.status !== undefined) {
      filters.status = query.status === "true" || query.status === true;
    }

    // Construir opciones de ordenamiento
    const sortOptions = {};
    if (sort) {
      sortOptions.price = sort === "asc" ? 1 : -1;
    }

    // Calcular paginación
    const skip = (page - 1) * limit;

    try {
      // Ejecutar consulta con paginación
      const products = await Product.find(filters)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      // Contar total de documentos
      const totalDocs = await Product.countDocuments(filters);
      const totalPages = Math.ceil(totalDocs / limit);

      // Calcular información de paginación
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const prevPage = hasPrevPage ? page - 1 : null;
      const nextPage = hasNextPage ? page + 1 : null;

      // Construir links
      const baseUrl = "/api/products";
      const queryParams = new URLSearchParams();
      
      if (limit !== 10) queryParams.append("limit", limit);
      if (query.category) queryParams.append("query", `category:${query.category}`);
      if (query.status !== undefined) queryParams.append("query", `status:${query.status}`);
      if (sort) queryParams.append("sort", sort);

      const queryString = queryParams.toString();
      const baseQuery = queryString ? `${baseUrl}?${queryString}` : baseUrl;

      const prevLink = hasPrevPage ? `${baseQuery}&page=${prevPage}` : null;
      const nextLink = hasNextPage ? `${baseQuery}&page=${nextPage}` : null;

      return {
        status: "success",
        payload: products,
        totalPages,
        prevPage,
        nextPage,
        page: parseInt(page),
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink
      };
    } catch (error) {
      throw new Error(`Error obteniendo productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      // Validar que el ID sea un ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de producto inválido");
      }
      
      const product = await Product.findById(id).lean();
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (error) {
      throw new Error(`Error obteniendo producto: ${error.message}`);
    }
  }

  async createProduct(productData) {
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

  async updateProduct(id, updateData) {
    try {
      // Validar que el ID sea un ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de producto inválido");
      }
      
      const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
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

  async deleteProduct(id) {
    try {
      // Validar que el ID sea un ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de producto inválido");
      }
      
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (error) {
      throw new Error(`Error eliminando producto: ${error.message}`);
    }
  }

  async getCategories() {
    try {
      const categories = await Product.distinct("category");
      return categories.sort();
    } catch (error) {
      throw new Error(`Error obteniendo categorías: ${error.message}`);
    }
  }
}

module.exports = new ProductService();