const productService = require("../services/productService");

class ProductsController {
  async getProducts(req, res) {
    try {
      const { limit, page, sort, query } = req.query;

      const options = {
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
        sort: sort || null,
        query: {},
      };

      if (query) {
        const queryParts = query.split(":");
        if (queryParts.length === 2) {
          const [key, value] = queryParts;
          if (key === "category") {
            options.query.category = value;
          } else if (key === "status") {
            options.query.status = value;
          }
        }
      }

      const result = await productService.getProducts(options);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async getProductById(req, res) {
    try {
      const { pid } = req.params;
      const product = await productService.getProductById(pid);
      res.json({
        status: "success",
        payload: product,
      });
    } catch (error) {
      res.status(404).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async createProduct(req, res) {
    try {
      const productData = req.body;
      const newProduct = await productService.createProduct(productData);
      res.status(201).json({
        status: "success",
        payload: newProduct,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const { pid } = req.params;
      const updateData = req.body;

      delete updateData._id;

      const updatedProduct = await productService.updateProduct(pid, updateData);
      res.json({
        status: "success",
        payload: updatedProduct,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { pid } = req.params;
      const deletedProduct = await productService.deleteProduct(pid);
      res.json({
        status: "success",
        message: "Producto eliminado correctamente",
        payload: deletedProduct,
      });
    } catch (error) {
      res.status(404).json({
        status: "error",
        error: error.message,
      });
    }
  }
}

module.exports = new ProductsController();

