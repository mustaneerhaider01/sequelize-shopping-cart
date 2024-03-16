"use strict";

const moment = require("moment");
const ApiError = require("../utils/api-error");

const tableName = "products";

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    tableName,
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
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

  Product.beforeCreate((product) => {
    product.dataValues.createdAt = moment().unix();
    product.dataValues.updatedAt = moment().unix();
  });

  Product.beforeUpdate((product) => {
    product.dataValues.updatedAt = moment().unix();
  });

  Product.associate = (models) => {
    Product.hasMany(models.CartItems, {
      as: "cartItems",
      foreignKey: "fk_product_id",
    });
  };

  Product.getOne = async (productId, transaction) => {
    const product = await Product.findOne({
      where: {
        id: Number(productId),
      },
      transaction,
    });

    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    return product;
  };

  return Product;
};
