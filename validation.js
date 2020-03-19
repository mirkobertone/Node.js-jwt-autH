const Joi = require('@hapi/joi');

const registerValidation = async data => {
  const schema = Joi.object({
    firstName: Joi.string()
      .min(4)
      .required(),
    lastName: Joi.string()
      .min(4)
      .required(),
    email: Joi.string()
      .min(4)
      .required()
      .email(),
    password1: Joi.string()
      .min(4)
      .required(),
    password2: Joi.string()
      .min(4)
      .required()
  });
  try {
    return (value = await schema.validateAsync(data));
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const loginValidation = async data => {
  const schema = Joi.object({
    email: Joi.string()
      .min(4)
      .required()
      .email(),
    password: Joi.string()
      .min(4)
      .required()
  });
  try {
    return (value = await schema.validateAsync(data));
  } catch (error) {
    throw error;
  }
};
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
