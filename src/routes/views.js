const express = require("express");
const productService = require("../services/productService");
const cartService = require("../services/cartService");


const router = express.Router();

// GET / - Vista home con todos los productos
router.get("/", async (req, res) => {
  try {
    const result = await productService.getProducts({ limit: 100 });
    const products = result.payload || [];
    res.render("home", { 
      title: "Inicio", 
      products: products 
    });
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.render("error", { 
      title: "Error", 
      error: "Error al cargar los productos" 
    });
  }
});

// GET /products - Vista de productos con paginaci�n
router.get("/products", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    
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
          options.query.status = value === "true";
        }
      }
    }

    const result = await productService.getProducts(options);
    const categories = await productService.getCategories();
    
    // Extraer la categoría seleccionada para la comparación
    let selectedCategory = "";
    if (query && query.startsWith("category:")) {
      selectedCategory = query.split(":")[1];
    }
    
    res.render("products", {
      title: "Productos",
      ...result,
      query: query || "",
      sort: sort || "",
      categories: categories,
      selectedCategory: selectedCategory
    });
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.render("error", { 
      title: "Error", 
      error: "Error al cargar los productos" 
    });
  }
});

// GET /products/:pid - Vista de detalle de producto
router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productService.getProductById(pid);
    
    res.render("productDetail", {
      title: product.title,
      product: product
    });
  } catch (error) {
    console.error("Error obteniendo producto:", error);
    res.render("error", { 
      title: "Error", 
      error: "Producto no encontrado" 
    });
  }
});

// GET /carts/:cid - Vista de carrito espec�fico
router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartById(cid);
    
    res.render("cart", {
      title: "Carrito",
      cart: cart
    });
  } catch (error) {
    console.error("Error obteniendo carrito:", error);
    res.render("error", { 
      title: "Error", 
      error: "Carrito no encontrado" 
    });
  }
});

// GET /realtimeproducts - Vista de productos en tiempo real
router.get("/realtimeproducts", async (req, res) => {
  try {
    const result = await productService.getProducts({ limit: 100 });
    const products = result.payload || [];
    
    res.render("realTimeProducts", {
      title: "Productos en Tiempo Real",
      products: products
    });
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.render("error", { 
      title: "Error", 
      error: "Error al cargar los productos" 
    });
  }
});

module.exports = router;
