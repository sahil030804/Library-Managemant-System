import express from "express";
import borrowController from "./borrow.controller.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/borrow",
  auth.userAuthenticate,
  auth.memberStatusCheck,
  borrowController.borrowBook
);
router.post("/return", auth.userAuthenticate, borrowController.returnBook);
router.post("/extend", auth.userAuthenticate, borrowController.extendBorrowing);

export default router;
