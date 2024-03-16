const Joi = require("joi");

module.exports = {
  validateSignup: Joi.object({
    username: Joi.string().optional().allow(null, "").label("Username"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).required().label("Password"),
  }),
  validateLogin: Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).required().label("Password"),
  }),
};
