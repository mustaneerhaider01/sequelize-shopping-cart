"use strict";

const moment = require("moment");
const ApiError = require("../utils/api-error");

const tableName = "carts";

module.exports = (sequelize, DataTypes) => {
  const Models = sequelize.models;
  const Cart = sequelize.define(
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

  Cart.beforeCreate((cart) => {
    cart.dataValues.createdAt = moment().unix();
    cart.dataValues.updatedAt = moment().unix();
  });

  Cart.beforeUpdate((cart) => {
    cart.dataValues.updatedAt = moment().unix();
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.Users, {
      as: "user",
      foreignKey: "fk_user_id",
    });

    Cart.hasMany(models.CartItems, {
      as: "cartItems",
      foreignKey: "fk_cart_id",
    });
  };

  Cart.getOne = async (userId, transaction) => {
    const cart = await Cart.findOne({
      where: {
        fk_user_id: Number(userId),
      },
      transaction,
    });

    if (!cart) {
      throw new ApiError(404, "Cart not found.");
    }

    return cart;
  };

  Cart.structurizeCartItems = (cartItems) => {
    const structuredCartItems = cartItems.map((cartItem) => ({
      id: cartItem.id,
      quantity: cartItem.quantity,
      name: cartItem.product.title,
      image: cartItem.product.image,
      price: cartItem.quantity * parseFloat(cartItem.product.price),
    }));

    return structuredCartItems;
  };

  Cart.getUserCartItems = async (userId, transaction) => {
    const cart = await Cart.findAll({
      attributes: [],
      include: [
        {
          model: Models.cart_items,
          as: "cartItems",
          attributes: ["id", "quantity"],
          include: [
            {
              model: Models.products,
              as: "product",
              required: false,
              attributes: ["id", "title", "image", "price"],
            },
          ],
        },
      ],
      where: {
        fk_user_id: Number(userId),
      },
      transaction,
    });

    return cart[0] ? cart[0].cartItems : [];
  };

  return Cart;
};
