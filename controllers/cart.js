const { sequelize, CartItems, Products, Carts } = require("../models");
const ApiError = require("../utils/api-error");

module.exports = {
  addItem: async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const {
        body: { productId },
        currDate,
        user,
      } = req;

      await Products.getOne(productId, transaction);

      const cart = await Carts.getOne(user.id, transaction);

      const existingCartItem = await CartItems.getOne(
        cart.id,
        productId,
        transaction,
      );

      let successResMessage;

      if (!existingCartItem || existingCartItem.archived) {
        const [cartItem, created] = await CartItems.unscoped().findOrCreate({
          where: {
            fk_cart_id: cart.id,
            fk_product_id: productId,
            quantity: 0,
          },
          defaults: {
            quantity: 1,
            createdAt: currDate,
            updatedAt: currDate,
          },
          transaction,
        });

        if (!created) {
          await cartItem.update(
            {
              quantity: 1,
              archived: false,
              updatedAt: currDate,
            },
            { transaction },
          );
        }

        successResMessage = "Item added to cart";
      } else {
        await existingCartItem.update(
          {
            quantity: existingCartItem.quantity + 1,
            updatedAt: currDate,
          },
          { transaction },
        );

        successResMessage = "Item quantity increased";
      }

      await transaction.commit();

      res.send({
        status: 200,
        success: true,
        message: successResMessage,
      });
    } catch (err) {
      await transaction.rollback();
      next(err);
    }
  },
  removeItem: async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const {
        body: { productId },
        currDate,
        user,
      } = req;

      await Products.getOne(productId, transaction);

      const cart = await Carts.getOne(user.id, transaction);

      const cartItem = await CartItems.getOne(cart.id, productId, transaction);

      if (!cartItem || cartItem.archived) {
        throw new ApiError(404, "Cart item not found");
      }

      let successResMessage;

      if (cartItem.quantity === 1) {
        await cartItem.update(
          {
            quantity: 0,
            archived: true,
            updatedAt: currDate,
          },
          { transaction },
        );

        successResMessage = "Item removed from cart";
      } else {
        await cartItem.update(
          {
            quantity: cartItem.quantity - 1,
            updatedAt: currDate,
          },
          { transaction },
        );

        successResMessage = "Item quantity decreased";
      }

      await transaction.commit();

      res.send({
        status: 200,
        success: true,
        message: successResMessage,
      });
    } catch (err) {
      await transaction.rollback();
      next(err);
    }
  },
  cartItems: async (req, res, next) => {
    try {
      const cartItems = await Carts.getUserCartItems(req.user.id);

      res.send({
        status: 200,
        success: true,
        message: "Cart items fetched",
        data: {
          cartItems,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
