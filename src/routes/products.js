const express = require("express");
const productService = require("../services/productService");
const { authenticateAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// GET / - Listar productos con paginación, filtros y ordenamiento
router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    
    // Parsear query params
    const options = {
      limit: limit ? parseInt(limit) : 10,
      page: page ? parseInt(page) : 1,
      sort: sort || null,
      query: {}
    };

    // Parsear filtros de query
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
      error: error.message 
    });
  }
});

// GET /:pid - Obtener producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productService.getProductById(pid);
    res.json({ 
      status: "success", 
      payload: product 
    });
  } catch (error) {
    res.status(404).json({ 
      status: "error", 
      error: error.message 
    });
  }
});

// POST / - Crear nuevo producto (Solo admin)
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const productData = req.body;
    
    // Validar campos requeridos
    const requiredFields = ["title", "description", "code", "price", "stock", "category"];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return res.status(400).json({
          status: "error",
          error: `El campo ${field} es requerido`
        });
      }
    }
    
    // Validar tipos de datos
    if (typeof productData.price !== "number" || productData.price <= 0) {
      return res.status(400).json({
        status: "error",
        error: "El precio debe ser un número mayor a 0"
      });
    }
    
    if (typeof productData.stock !== "number" || productData.stock < 0) {
      return res.status(400).json({
        status: "error",
        error: "El stock debe ser un número mayor o igual a 0"
      });
    }
    
    const createdProduct = await productService.createProduct(productData);
    res.status(201).json({ 
      status: "success", 
      payload: createdProduct 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      error: error.message 
    });
  }
});

// PUT /:pid - Actualizar producto (Solo admin)
router.put("/:pid", authenticateAdmin, async (req, res) => {
  try {
    const { pid } = req.params;
    const updateData = req.body;
    
    // No permitir actualizar el ID
    delete updateData._id;
    
    const updatedProduct = await productService.updateProduct(pid, updateData);
    res.json({ 
      status: "success", 
      payload: updatedProduct 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      error: error.message 
    });
  }
});

// DELETE /:pid - Eliminar producto (Solo admin)
router.delete("/:pid", authenticateAdmin, async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await productService.deleteProduct(pid);
    res.json({ 
      status: "success", 
      message: "Producto eliminado correctamente",
      payload: deletedProduct 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      error: error.message 
    });
  }
});

module.exports = router;
