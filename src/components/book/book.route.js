import express from "express";
import bookController from "./book.controller.js";
import bookValidation from "./book.validation.js";
import validation from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/books",
  auth.userAuthenticate,
  auth.accessRole(["admin"]),
  validation.validate(bookValidation.addBookValidate),
  bookController.addBook
);

router.put(
  "/books/:id",
  auth.userAuthenticate,
  auth.accessRole(["admin"]),
  validation.validate(bookValidation.addBookValidate),
  bookController.updateBook
);

router.delete(
  "/books/:id",
  auth.userAuthenticate,
  auth.accessRole(["admin"]),
  bookController.RemoveBook
);

router.get(
  "/books",
  auth.userAuthenticate,
  auth.accessRole(["admin", "member"]),
  bookController.getAllbooks
);

export default router;
