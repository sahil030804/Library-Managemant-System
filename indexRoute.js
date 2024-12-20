import express from "express";
import authRouter from "./src/components/auth/auth.route.js";
import bookRouter from "./src/components/book/book.route.js";
import memberRouter from "./src/components/member/member.route.js";
import borrowRouter from "./src/components/borrow/borrow.route.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/books", bookRouter);
router.use("/members", memberRouter);
router.use("/", borrowRouter);

export default router;
