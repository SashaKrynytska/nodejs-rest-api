const Joi = require("joi");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required(),
  subscription: Joi.string(),
  token: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const userVerifyJoiSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

// const schemas = {
//   registerSchema,
//   loginSchema,
// };

// module.exports = { schemas };

module.exports = { registerSchema, loginSchema, userVerifyJoiSchema };
