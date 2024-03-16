const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = {
  createToken: (payload) => {
    return jwt.sign(payload, config.get("jwtSecret"), { expiresIn: "7d" });
  },
  verifyToken: (token) => {
    return jwt.verify(token, config.get("jwtSecret"));
  },
};
