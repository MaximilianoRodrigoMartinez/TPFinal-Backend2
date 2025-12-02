const express = require("express");
const cartsController = require("../controllers/cartsController");
const { authenticateUser } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", cartsController.createCart.bind(cartsController));
router.get("/:cid", cartsController.getCartById.bind(cartsController));
router.post("/:cid/product/:pid", authenticateUser, cartsController.addProductToCart.bind(cartsController));
router.delete("/:cid/products/:pid", cartsController.removeProductFromCart.bind(cartsController));
router.put("/:cid", cartsController.updateCartProducts.bind(cartsController));
router.put("/:cid/products/:pid", cartsController.updateProductQuantity.bind(cartsController));
router.delete("/:cid", cartsController.clearCart.bind(cartsController));
router.post("/:cid/purchase", authenticateUser, cartsController.purchase.bind(cartsController));

module.exports = router;
