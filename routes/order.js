const express = require("express");
const orderController = require("../controllers/order");

const router = express.Router();

router.post("/create", orderController.create);
router.get("/items", orderController.items);

module.exports = router;
