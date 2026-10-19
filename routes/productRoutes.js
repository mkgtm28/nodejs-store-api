
const express = require("express");
const router = express.Router();

const productController = require('../controllers/productControllers');
const validateProduct = require('../middleware/validateProduct');

router.get("/page", productController.getPaginatedProducts);


router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

router.post("/", validateProduct, productController.createProduct);
router.put("/:id", validateProduct, productController.updateProduct);
router.delete("/:id", productController.deleteProduct);


module.exports = router;
