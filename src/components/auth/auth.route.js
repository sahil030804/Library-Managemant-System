import express from "express";
import authController from "./auth.controller.js";
import authValidation from "./auth.validation.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/register",
  auth.validate(authValidation.userValidate),
  authController.registerUser
);

export default router;
