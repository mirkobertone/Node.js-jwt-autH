const Joi = require('@hapi/joi');

const registerValidation = async data => {
  const schema = Joi.object({
    name: Joi.string()
      .min(4)
      .required(),
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
    console.log('thow error in validation');
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
