const Joi = require("joi");

const contactJoiSchema = Joi.object({
  name: Joi.string().min(3).alphanum().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "uk", "ua", "org"] },
    })
    .required(),
  phone: Joi.string().min(5).max(10).required(),
  favorite: Joi.boolean(),
});

const favJoiSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  contactJoiSchema,
  favJoiSchema,
};
