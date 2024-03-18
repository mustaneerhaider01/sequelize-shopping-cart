"use strict";

const moment = require("moment");

const tableName = "orders";

module.exports = (sequelize, DataTypes) => {
  const Models = sequelize.models;
  const Order = sequelize.define(
    tableName,
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      fk_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      defaultScope: {
        where: {
          archived: false,
        },
      },
    }
  );

  Order.beforeCreate((order) => {
    order.dataValues.createdAt = moment().unix();
    order.dataValues.updatedAt = moment().unix();
  });

  Order.beforeUpdate((order) => {
    order.dataValues.updatedAt = moment().unix();
  });

  Order.associate = (models) => {
    Order.belongsTo(models.Users, {
      as: "user",
      foreignKey: "fk_user_id",
    });

    Order.hasMany(models.OrderItems, {
      as: "orderItems",
      foreignKey: "fk_order_id",
    });
  };

  Order.structurizeOrders = (orders) => {
    const structuredOrders = (orders = orders.map((order) => ({
      orderId: order.id,
      totalAmount: parseFloat(order.totalAmount),
      items: order.orderItems.map((orderItem) => ({
        id: orderItem.id,
        amount: parseFloat(orderItem.amount),
        name: orderItem.product.title,
        image: orderItem.product.image,
      })),
    })));

    return structuredOrders;
  };

  Order.getUserOrders = async (userId, transaction) => {
    const orders = await Order.findAll({
      attributes: ["id", "totalAmount"],
      include: [
        {
          model: Models.order_items,
          as: "orderItems",
          attributes: ["id", "amount"],
          include: [
            {
              model: Models.products,
              as: "product",
              required: false,
              attributes: ["title", "image"],
            },
          ],
        },
      ],
      where: {
        fk_user_id: Number(userId),
      },
      transaction,
    });

    return orders;
  };

  return Order;
};
