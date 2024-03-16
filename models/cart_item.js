"use strict";

const moment = require("moment");

const tableName = "cart_items";

module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define(
    tableName,
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      fk_cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fk_product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
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

  CartItem.beforeCreate((cartItem) => {
    cartItem.dataValues.createdAt = moment().unix();
    cartItem.dataValues.updatedAt = moment().unix();
  });

  CartItem.beforeUpdate((cartItem) => {
    cartItem.dataValues.updatedAt = moment().unix();
  });

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Carts, {
      as: "cart",
      foreignKey: "fk_cart_id",
    });

    CartItem.belongsTo(models.Products, {
      as: "product",
      foreignKey: "fk_product_id",
    });
  };

  CartItem.getOne = async (cartId, productId, transaction) => {
    const cartItem = await CartItem.unscoped().findOne({
      where: {
        fk_cart_id: Number(cartId),
        fk_product_id: Number(productId),
      },
      transaction,
    });

    return cartItem;
  };

  return CartItem;
};
