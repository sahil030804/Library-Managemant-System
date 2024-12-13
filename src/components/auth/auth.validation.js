import Joi from "joi";

const userRegisterValidate = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name can't be not null",
    "any.required": "name must be required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email id can't be not null",
    "any.required": "Email id must be required",
  }),
  password: Joi.string().required().min(6).max(18).messages({
    "string.empty": "Password can't be not null",
    "any.required": "Password must be required",
    "string.min": "Password must be 6 character long",
    "string.max": "Password must be 18 character long",
  }),
  phone: Joi.string()
    .required()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "String.empty": "Phone number can't be not null",
      "any.required": "Phone number must be required",
      "string.pattern.base": "Phone number must be exactly 10 digits.",
    }),
  address: Joi.string().required().messages({
    "string.empty": "Name can't be not null",
    "any.required": "name must be required",
  }),
});
const resetPasswordValidate = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email id can't be not null",
    "any.required": "Email id must be required",
  }),
  new_password: Joi.string().required().min(6).max(18).messages({
    "string.empty": "Password can't be not null",
    "any.required": "Password must be required",
    "string.min": "Password must be 6 character long",
    "string.max": "Password must be 18 character long",
  }),
});
const userLoginValidate = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email id can't be not null",
    "any.required": "Email id must be required",
  }),
  password: Joi.string().required().min(6).max(18).messages({
    "string.empty": "Password can't be not null",
    "any.required": "Password must be required",
    "string.min": "Password must be 6 character long",
    "string.max": "Password must be 18 character long",
  }),
});

export default {
  userRegisterValidate,
  userLoginValidate,
  resetPasswordValidate,
};
