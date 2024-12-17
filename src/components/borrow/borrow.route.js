import express from "express";
import borrowController from "./borrow.controller.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post("/borrow", auth.userAuthenticate, borrowController.borrowBook);

export default router;
