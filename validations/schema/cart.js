const Joi = require("joi");

module.exports = {
  validateAddCartItem: Joi.object({
    productId: Joi.number().required().label("Product Id"),
  }),
};
