const Joi = require("joi");

module.exports = {
  validateAddProduct: Joi.object({
    title: Joi.string().min(3).required().label("Title"),
    price: Joi.number()
      .positive()
      .precision(2)
      .strict()
      .required()
      .label("Price"),
    image: Joi.string().uri().required().label("Image"),
    description: Joi.string().min(8).required().label("Description"),
  }),
};
