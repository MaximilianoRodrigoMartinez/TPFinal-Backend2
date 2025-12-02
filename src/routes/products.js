const express = require("express");
const productsController = require("../controllers/productsController");
const { authenticateAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", productsController.getProducts.bind(productsController));
router.get("/:pid", productsController.getProductById.bind(productsController));
router.post("/", authenticateAdmin, productsController.createProduct.bind(productsController));
router.put("/:pid", authenticateAdmin, productsController.updateProduct.bind(productsController));
router.delete("/:pid", authenticateAdmin, productsController.deleteProduct.bind(productsController));

module.exports = router;
