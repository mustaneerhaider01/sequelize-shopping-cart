"use strict";

const moment = require("moment");
const ApiError = require("../utils/api-error");

const tableName = "users";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    tableName,
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Anonymous",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
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

  User.beforeCreate((user) => {
    user.dataValues.createdAt = moment().unix();
    user.dataValues.updatedAt = moment().unix();
  });

  User.beforeUpdate((user) => {
    user.dataValues.updatedAt = moment().unix();
  });

  User.associate = (models) => {
    User.hasOne(models.Carts, {
      as: "cart",
      foreignKey: "fk_user_id",
    });

    User.hasOne(models.Orders, {
      as: "order",
      foreignKey: "fk_user_id",
    });
  };

  User.emailExists = async (email, throwIfExists, transaction) => {
    const user = await User.unscoped().findOne({
      where: { email },
      transaction,
    });

    if (user && throwIfExists) {
      throw new ApiError(400, "Email is already in use.");
    }

    if (!user && !throwIfExists) {
      throw new ApiError(404, "User not found.");
    }

    return user;
  };

  return User;
};
