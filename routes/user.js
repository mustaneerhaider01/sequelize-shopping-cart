const express = require("express");
const userController = require("../controllers/user");
const {
  validateSignup,
  validateLogin,
} = require("../validations/validators/user");
const cartRouter = require("./cart");
const isAuthenticated = require("../middlewares/is-auth");

const router = express.Router();

router.use("/cart", isAuthenticated, cartRouter);

router.post("/signup", validateSignup, userController.signup);
router.post("/login", validateLogin, userController.login);

module.exports = router;
