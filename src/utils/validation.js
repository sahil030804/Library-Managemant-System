import Joi from "joi";
const paginationValidate = Joi.object({
  page: Joi.number().min(1).required().messages({
    "number.base": "Page must be a number",
    "number.empty": "Page can't be empty",
    "number.min": `Page number must be at least {#limit}`,
    "any.required": "Page is required",
  }),
  limit: Joi.number().min(15).required().messages({
    "number.base": "Limit must be a number",
    "number.empty": "Limit can't be empty",
    "number.min": `Limit number must be at least {#limit}`,
    "any.required": "Limit is required",
  }),
  search: Joi.string().allow("").messages({
    "string.base": "Search must be a string",
  }),
});

export default paginationValidate;
