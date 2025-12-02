const cartService = require("../services/cartService");
const productService = require("../services/productService");
const ticketService = require("../services/ticketService");

class CartsController {
  async createCart(req, res) {
    try {
      const newCart = await cartService.createCart();
      res.status(201).json({
        status: "success",
        payload: newCart,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async getCartById(req, res) {
    try {
      const { cid } = req.params;
      const cart = await cartService.getCartById(cid);
      res.json({
        status: "success",
        payload: cart,
      });
    } catch (error) {
      res.status(404).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity = 1 } = req.body;

      const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
      res.json({
        status: "success",
        payload: updatedCart,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const updatedCart = await cartService.removeProductFromCart(cid, pid);
      res.json({
        status: "success",
        payload: updatedCart,
      });
    } catch (error) {
      res.status(404).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async updateCartProducts(req, res) {
    try {
      const { cid } = req.params;
      const { products } = req.body;

      if (!Array.isArray(products)) {
        return res.status(400).json({
          status: "error",
          error: "Los productos deben ser un array",
        });
      }

      const updatedCart = await cartService.updateCartProducts(cid, products);
      res.json({
        status: "success",
        payload: updatedCart,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      if (typeof quantity !== "number" || quantity < 0) {
        return res.status(400).json({
          status: "error",
          error: "La cantidad debe ser un número mayor o igual a 0",
        });
      }

      const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);
      res.json({
        status: "success",
        payload: updatedCart,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async clearCart(req, res) {
    try {
      const { cid } = req.params;
      const updatedCart = await cartService.clearCart(cid);
      res.json({
        status: "success",
        payload: updatedCart,
      });
    } catch (error) {
      res.status(404).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async purchase(req, res) {
    try {
      const { cid } = req.params;
      const user = req.user;

      if (user.cart && user.cart.toString() !== cid) {
        return res.status(403).json({
          status: "error",
          error: "No tienes permiso para acceder a este carrito",
        });
      }

      const cart = await cartService.getCartById(cid);

      if (!cart || !cart.products || cart.products.length === 0) {
        return res.status(400).json({
          status: "error",
          error: "El carrito está vacío",
        });
      }

      const processedProducts = [];
      const unprocessedProductIds = [];
      let totalAmount = 0;

      for (const item of cart.products) {
        const product = item.product;
        const requestedQuantity = item.quantity;
        const productId = product._id ? product._id.toString() : product.toString();

        try {
          if (product.stock >= requestedQuantity && product.status !== false) {
            await productService.updateStock(productId, requestedQuantity);
            const subtotal = product.price * requestedQuantity;
            totalAmount += subtotal;
            processedProducts.push({
              product: productId,
              quantity: requestedQuantity,
            });
          } else {
            unprocessedProductIds.push(productId);
          }
        } catch (error) {
          unprocessedProductIds.push(productId);
        }
      }

      let ticket = null;
      if (processedProducts.length > 0 && totalAmount > 0) {
        ticket = await ticketService.createTicket({
          amount: totalAmount,
          purchaser: user.email,
        });
      }

      const remainingProducts = cart.products.filter((item) => {
        const productId = item.product._id
          ? item.product._id.toString()
          : item.product.toString();
        return unprocessedProductIds.includes(productId);
      });

      const remainingProductsFormatted = remainingProducts.map((item) => {
        const productId = item.product._id
          ? item.product._id
          : item.product;
        return {
          product: productId,
          quantity: item.quantity,
        };
      });

      await cartService.updateCartWithProducts(cid, remainingProductsFormatted);

      const response = {
        status: "success",
        message: processedProducts.length > 0
          ? "Compra procesada parcialmente"
          : "No se pudo procesar ninguna compra",
        payload: {
          ticket: ticket
            ? {
                _id: ticket._id,
                code: ticket.code,
                purchase_datetime: ticket.purchase_datetime,
                amount: ticket.amount,
                purchaser: ticket.purchaser,
              }
            : null,
          unprocessedProducts: unprocessedProductIds,
        },
      };

      if (!ticket && unprocessedProductIds.length > 0) {
        return res.status(400).json({
          status: "error",
          error: "No se pudo procesar ninguna compra debido a stock insuficiente",
          payload: {
            unprocessedProducts: unprocessedProductIds,
          },
        });
      }

      if (ticket) {
        return res.status(201).json(response);
      }

      return res.status(400).json({
        status: "error",
        error: "No se pudo procesar la compra",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
  }
}

module.exports = new CartsController();

