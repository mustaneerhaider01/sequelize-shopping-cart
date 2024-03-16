const ApiError = require("../../utils/api-error");
const {
  cart: { validateAddCartItem },
} = require("../schema");

module.exports = {
  validateAddCartItem: (req, res, next) => {
    if (req.body.productId) {
      req.body.productId = Number(req.body.productId);
    }

    const { error } = validateAddCartItem.validate(req.body, {
      errors: { label: "key", wrap: { label: false } },
    });
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    next();
  },
};
