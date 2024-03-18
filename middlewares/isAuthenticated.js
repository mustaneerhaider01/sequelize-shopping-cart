const { Users } = require("../models");
const JwtService = require("../services/jwt-service");
const ApiError = require("../utils/api-error");
const moment = require("moment");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      throw new ApiError(401, "Unauthorized access not allowed.");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Unauthorized access not allowed.");
    }

    const decodedToken = JwtService.verifyToken(token);

    if (!decodedToken) {
      throw new ApiError(401, "Unauthorized access not allowed.");
    }

    const user = await Users.findOne({
      where: {
        id: Number(decodedToken.userId),
      },
    });

    req.user = user;
    req.currDate = moment().unix();
    next();
  } catch (err) {
    next(err);
  }
};
