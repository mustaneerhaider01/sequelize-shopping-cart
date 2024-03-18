const express = require("express");
const userController = require("../controllers/user");
const {
  validateSignup,
  validateLogin,
} = require("../validations/validators/user");
const isAuthenticated = require("../middlewares/isAuthenticated");
const cartRouter = require("./cart");
const orderRouter = require("./order");

const router = express.Router();

router.use("/cart", isAuthenticated, cartRouter);
router.use("/orders", isAuthenticated, orderRouter);

router.post("/signup", validateSignup, userController.signup);
router.post("/login", validateLogin, userController.login);

module.exports = router;
