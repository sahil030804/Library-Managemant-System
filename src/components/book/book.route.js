import express from "express";
import bookController from "./book.controller.js";
import bookValidation from "./book.validation.js";
import validation from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  auth.userAuthenticate,
  auth.accessRole(["admin"]),
  validation.validate(bookValidation.addBookValidate),
  bookController.addBook
);

router.put(
  "/:id",
  auth.userAuthenticate,
  auth.accessRole(["admin"]),
  validation.validate(bookValidation.addBookValidate),
  bookController.updateBook
);

router.delete(
  "/:id",
  auth.userAuthenticate,
  auth.accessRole(["admin"]),
  bookController.RemoveBook
);

router.get("/search", bookController.searchBook);
router.get("/", bookController.getAllbooks);
router.get("/:id", bookController.getSinglebook);

export default router;
