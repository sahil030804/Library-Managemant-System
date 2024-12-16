import Joi from "joi";

const memberRegisterValidate = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name can't be null",
    "any.required": "name must be required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email id can't be null",
    "any.required": "Email id must be required",
  }),
  password: Joi.string().required().min(6).max(18).messages({
    "string.empty": "Password can't be null",
    "any.required": "Password must be required",
    "string.min": "Password must be 6 character long",
    "string.max": "Password must be 18 character long",
  }),
  confirm_password: Joi.string().required().min(6).max(18).messages({
    "string.empty": "Confirm password can't be null",
    "any.required": "Confirm password must be required",
    "string.min": "Confirm password must be 6 character long",
    "string.max": "Confirm password must be 18 character long",
  }),
  phone: Joi.string()
    .required()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "String.empty": "Phone number can't be null",
      "any.required": "Phone number must be required",
      "string.pattern.base": "Phone number must be exactly 10 digits.",
    }),
  address: Joi.string().required().messages({
    "string.empty": "Name can't be null",
    "any.required": "name must be required",
  }),
  role: Joi.string().empty().required().messages({
    "string.empty": "Role can't be null",
    "any.required": "Role must be required",
  }),
  status: Joi.string().empty().required().messages({
    "string.empty": "Status can't be null",
    "any.required": "Status must be required",
  }),
});

export default memberRegisterValidate;
