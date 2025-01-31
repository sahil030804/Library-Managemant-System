import express from "express";
import bookController from "./book.controller.js";
import bookValidation from "./book.validation.js";
import paginationValidate from "../../utils/validation.js";
import validation from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";
import { USER_ROLE } from "../../utils/constant.js";
import borrowController from "../borrow/borrow.controller.js";

const router = express.Router();

router.post(
  "/",
  auth.isUserLoggedIn,
  auth.accessRole([USER_ROLE.ADMIN]),
  validation.validate(bookValidation.bookValidate),
  bookController.addBook
);

router.put(
  "/:id",
  auth.isUserLoggedIn,
  auth.accessRole([USER_ROLE.ADMIN]),
  validation.validate(bookValidation.bookValidate),
  bookController.updateBook
);

router.delete(
  "/:id",
  auth.isUserLoggedIn,
  auth.accessRole([USER_ROLE.ADMIN]),
  bookController.removeBook
);
router.get(
  "/borrowed",
  auth.isUserLoggedIn,
  auth.accessRole([USER_ROLE.MEMBER]),
  borrowController.borrowHistory
);
router.post(
  "/overdue",
  auth.isUserLoggedIn,
  auth.accessRole([USER_ROLE.ADMIN]),
  borrowController.allMembersOverdueHistory
);
router.get("/search", bookController.searchBook);
router.post(
  "/list",
  validation.validate(paginationValidate),
  bookController.getAllbooks
);
router.get("/:id", bookController.getSinglebook);

router.post(
  "/borrow",
  auth.isUserLoggedIn,
  auth.accessRole([USER_ROLE.MEMBER]),
  auth.memberStatusCheck,
  borrowController.borrowBook
);
router.post(
  "/return",
  auth.isUserLoggedIn,
  auth.accessRole([USER_ROLE.MEMBER]),
  borrowController.returnBook
);
router.post(
  "/extend",
  auth.isUserLoggedIn,
  auth.accessRole([USER_ROLE.MEMBER]),
  borrowController.extendBorrowing
);

export default router;
