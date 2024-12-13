import Joi from "joi";

const addBookValidate = Joi.object({
  title: Joi.string().empty().required().messages({
    "string.empty": "Title can't be empty",
    "any.required": "Title must be required",
  }),
  authors: Joi.string().empty().required().messages({
    "string.empty": "Authors can't be empty",
    "any.required": "Authors must be required",
  }),
  ISBN: Joi.string().empty().required().messages({
    "string.empty": "ISBN can't be empty",
    "any.required": "ISBN must be required",
  }),
  category: Joi.string().empty().trim().required().messages({
    "string.empty": "Category can't be empty",
    "any.required": "Category must be required",
  }),
  publicationYear: Joi.string()
    .pattern(/^[0-9]{4}$/)
    .empty()
    .required()
    .messages({
      "string.empty": "Publication year can't be empty",
      "any.required": "Publication year must be required",
      "string.pattern.base": "Publication year must be exactly 4 digits.",
    }),
  totalCopies: Joi.number().min(1).empty().required().messages({
    "number.empty": "Total copies year can't be empty",
    "any.required": "Total copies year must be required",
    "number.min": "Total copies at least 1",
  }),
  shelfNumber: Joi.string().empty().required().messages({
    "string.empty": "Shelf number can't be empty",
    "any.required": "Shelf number must be required",
  }),
});

const updateBookValidate = Joi.object({
  title: Joi.string().empty().messages({
    "string.empty": "Title can't be empty",
  }),
  authors: Joi.string().empty().messages({
    "string.empty": "Authors can't be empty",
  }),
  ISBN: Joi.string().empty().messages({
    "string.empty": "ISBN can't be empty",
  }),
  category: Joi.string().trim().empty().messages({
    "string.empty": "Category can't be empty",
    "string.trim": "no whitespaces",
  }),
  publicationYear: Joi.string()
    .pattern(/^[0-9]{4}$/)
    .empty()
    .messages({
      "string.empty": "Publication year can't be empty",
      "string.pattern.base": "Publication year must be exactly 4 digits.",
    }),
  totalCopies: Joi.number().min(1).empty().messages({
    "number.empty": "Total copies year can't be empty",
    "number.min": "Total copies at least 1",
  }),
  shelfNumber: Joi.string().empty().messages({
    "string.empty": "Shelf number can't be empty",
  }),
});

export default { addBookValidate, updateBookValidate };
