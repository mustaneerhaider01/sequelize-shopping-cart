"use strict";

const moment = require("moment");

const tableName = "orders";

module.exports = (sequelize, DataTypes) => {
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
        type: DataTypes.INTEGER,
        allowNull: false,
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
    },
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

  return Order;
};
