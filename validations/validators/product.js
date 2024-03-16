// validations
const ApiError = require("../../utils/api-error");
const {
  product: { validateAddProduct },
} = require("../schema");

module.exports = {
  validateAddProduct: (req, res, next) => {
    const { error } = validateAddProduct.validate(req.body, {
      errors: { label: "key", wrap: { label: false } },
    });
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    next();
  },
};
