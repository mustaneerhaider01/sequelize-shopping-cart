"use strict";

const moment = require("moment");

const tableName = "order_items";

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    tableName,
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      fk_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fk_product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
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

  OrderItem.beforeCreate((orderItem) => {
    orderItem.dataValues.createdAt = moment().unix();
    orderItem.dataValues.updatedAt = moment().unix();
  });

  OrderItem.beforeUpdate((orderItem) => {
    orderItem.dataValues.updatedAt = moment().unix();
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Orders, {
      as: "order",
      foreignKey: "fk_order_id",
    });

    OrderItem.belongsTo(models.Products, {
      as: "product",
      foreignKey: "fk_product_id",
    });
  };

  return OrderItem;
};
