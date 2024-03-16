// validations
const ApiError = require("../../utils/api-error");
const {
  user: { validateSignup, validateLogin },
} = require("../schema");

module.exports = {
  validateSignup: (req, res, next) => {
    const { error } = validateSignup.validate(req.body, {
      errors: { label: "key", wrap: { label: false } },
    });
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    next();
  },
  validateLogin: (req, res, next) => {
    const { error } = validateLogin.validate(req.body, {
      errors: { label: "key", wrap: { label: false } },
    });
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    next();
  },
};
