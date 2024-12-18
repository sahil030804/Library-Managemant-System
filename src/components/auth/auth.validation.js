import Joi from "joi";

const userRegisterValidate = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name cannot be empty.",
    "any.required": "Name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email cannot be empty.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).max(18).required().messages({
    "string.empty": "Password cannot be empty.",
    "any.required": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
    "string.max": "Password cannot exceed 18 characters.",
  }),
  confirm_password: Joi.string().required().messages({
    "string.empty": "Confirm Password cannot be empty.",
    "any.required": "Confirm Password is required.",
  }),
  phone: Joi.string()
    .required()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.empty": "Phone number cannot be empty.",
      "any.required": "Phone number is required.",
      "string.pattern.base": "Phone number must be exactly 10 digits.",
    }),
  address: Joi.string().required().messages({
    "string.empty": "Address cannot be empty.",
    "any.required": "Address is required.",
  }),
});

const resetPasswordValidate = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email cannot be empty.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  new_password: Joi.string().min(6).max(18).required().messages({
    "string.empty": "New Password cannot be empty.",
    "any.required": "New Password is required.",
    "string.min": "New Password must be at least 6 characters long.",
    "string.max": "New Password cannot exceed 18 characters.",
  }),
  confirm_password: Joi.string().required().messages({
    "string.empty": "Confirm Password cannot be empty.",
    "any.required": "Confirm Password is required.",
  }),
});

const userLoginValidate = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email cannot be empty.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).max(18).required().messages({
    "string.empty": "Password cannot be empty.",
    "any.required": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
    "string.max": "Password cannot exceed 18 characters.",
  }),
});

export default {
  userRegisterValidate,
  resetPasswordValidate,
  userLoginValidate,
};
