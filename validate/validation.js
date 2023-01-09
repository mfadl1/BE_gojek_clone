const Joi = require("@hapi/joi");

const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    phone_number: Joi.string().min(7).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).max(2048).required(),
  });
  
const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

module.exports = {
    loginSchema,
    registerSchema
}