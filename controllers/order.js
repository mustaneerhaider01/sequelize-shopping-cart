const {
  sequelize,
  Carts,
  Orders,
  OrderItems,
  CartItems,
} = require("../models");
const ApiError = require("../utils/api-error");

module.exports = {
  create: async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const { currDate, user } = req;

      const userCartItems = await Carts.getUserCartItems(user.id, transaction);

      if (userCartItems.length === 0) {
        throw new ApiError(400, "Cart is empty");
      }

      const createdOrder = await Orders.create(
        {
          fk_user_id: Number(user.id),
          createdAt: currDate,
          updatedAt: currDate,
        },
        { transaction }
      );

      const orderItems = userCartItems.map((item) => ({
        fk_order_id: createdOrder.id,
        fk_product_id: item.product.id,
        amount: item.quantity * parseFloat(item.product.price),
        createdAt: currDate,
        updatedAt: currDate,
      }));

      await OrderItems.bulkCreate(orderItems, { transaction });

      const orderTotalAmount = orderItems.reduce(
        (total, item) => total + parseFloat(item.amount),
        0
      );

      await createdOrder.update(
        {
          totalAmount: orderTotalAmount,
          updatedAt: currDate,
        },
        { transaction }
      );

      const cart = await Carts.getOne(user.id, transaction);

      const updatedCartItems = userCartItems.map((item) => ({
        id: item.id,
        fk_cart_id: cart.id,
        fk_product_id: item.product.id,
        quantity: 0,
        archived: true,
        createdAt: currDate,
        updatedAt: currDate,
      }));

      await CartItems.bulkCreate(updatedCartItems, {
        updateOnDuplicate: ["quantity", "archived", "updatedAt"],
        transaction,
      });

      await transaction.commit();

      res.send({
        status: 201,
        success: true,
        message: "Order created",
        data: {
          orderId: createdOrder.id,
        },
      });
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      next(err);
    }
  },
  items: async (req, res, next) => {
    try {
      let orders = await Orders.getUserOrders(req.user.id);

      orders = Orders.structurizeOrders(orders);

      res.send({
        status: 200,
        success: true,
        message: "Orders fetched",
        data: {
          orders,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
