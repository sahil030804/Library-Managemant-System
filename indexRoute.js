import express from "express";
import authRouter from "./src/components/auth/auth.route.js";
import bookRouter from "./src/components/book/book.route.js";
import memberRouter from "./src/components/member/member.route.js";

const router = express.Router();

router.use("/api/auth", authRouter);
router.use("/api", bookRouter);
router.use("/api", memberRouter);

export default router;
