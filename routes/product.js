const express = require("express");
const productController = require("../controllers/product");
const { validateAddProduct } = require("../validations/validators/product");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post(
  "/create",
  isAuthenticated,
  validateAddProduct,
  productController.addProduct
);
router.get("/all", isAuthenticated, productController.getAll);
router.get("/:productId", isAuthenticated, productController.getOne);
router.delete(
  "/:productId/delete",
  isAuthenticated,
  productController.deleteProduct
);

module.exports = router;
