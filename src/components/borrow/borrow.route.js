import express from "express";
import borrowController from "./borrow.controller.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/borrow/:id",
  auth.userAuthenticate,
  auth.memberStatusCheck,
  borrowController.borrowBook
);
router.post("/return/:id", auth.userAuthenticate, borrowController.returnBook);

export default router;
