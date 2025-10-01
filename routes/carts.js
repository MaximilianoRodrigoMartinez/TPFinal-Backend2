const express = require("express");
const cartService = require("../services/cartService");

const router = express.Router();

// POST / - Crear nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    res.status(201).json({ 
      status: "success", 
      payload: newCart 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      error: error.message 
    });
  }
});

// GET /:cid - Listar productos del carrito con populate
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartById(cid);
    res.json({ 
      status: "success", 
      payload: cart 
    });
  } catch (error) {
    res.status(404).json({ 
      status: "error", 
      error: error.message 
    });
  }
});

// POST /:cid/product/:pid - Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;
    
    const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
    res.json({ 
      status: "success", 
      payload: updatedCart 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      error: error.message 
    });
  }
});

// DELETE /:cid/products/:pid - Eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartService.removeProductFromCart(cid, pid);
    res.json({ 
      status: "success", 
      payload: updatedCart 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      error: error.message 
    });
  }
});

// PUT /:cid - Actualizar todos los productos del carrito
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    
    if (!Array.isArray(products)) {
      return res.status(400).json({
        status: "error",
        error: "Los productos deben ser un array"
      });
    }
    
    const updatedCart = await cartService.updateCartProducts(cid, products);
    res.json({ 
      status: "success", 
      payload: updatedCart 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      error: error.message 
    });
  }
});

// PUT /:cid/products/:pid - Actualizar cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    
    if (typeof quantity !== "number" || quantity < 0) {
      return res.status(400).json({
        status: "error",
        error: "La cantidad debe ser un número mayor o igual a 0"
      });
    }
    
    const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);
    res.json({ 
      status: "success", 
      payload: updatedCart 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      error: error.message 
    });
  }
});

// DELETE /:cid - Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCart = await cartService.clearCart(cid);
    res.json({ 
      status: "success", 
      payload: updatedCart 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      error: error.message 
    });
  }
});

module.exports = router;
