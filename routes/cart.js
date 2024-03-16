const express = require("express");
const cartController = require("../controllers/cart");
const { validateAddCartItem } = require("../validations/validators/cart");

const router = express.Router();

router.post("/addItem", validateAddCartItem, cartController.addItem);
router.put("/removeItem", validateAddCartItem, cartController.removeItem);
router.get("/items", cartController.cartItems);

module.exports = router;
