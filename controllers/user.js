const { Users, Carts, sequelize } = require("../models");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/api-error");
const JwtService = require("../services/jwt-service");

module.exports = {
  signup: async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const {
        body: { username, email, password },
        currDate,
      } = req;

      await Users.emailExists(email, true, transaction);

      const hashedPassword = await bcrypt.hash(password, 10);

      const createdUser = await Users.create(
        {
          username,
          email,
          password: hashedPassword,
          createdAt: currDate,
          updatedAt: currDate,
        },
        { transaction }
      );

      await Carts.create(
        {
          fk_user_id: createdUser.id,
          createdAt: currDate,
          updatedAt: currDate,
        },
        { transaction }
      );

      await transaction.commit();

      res.send({
        status: 201,
        success: true,
        message: "User created",
        data: {
          userId: createdUser.id,
        },
      });
    } catch (err) {
      await transaction.rollback();
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await Users.emailExists(email, false);

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password.");
      }

      const authToken = JwtService.createToken({
        userId: user.id,
        email: user.email,
      });

      res.send({
        status: 200,
        success: true,
        message: "User logged in",
        data: {
          token: authToken,
          expiresIn: "7d",
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
