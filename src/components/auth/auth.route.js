import express from "express";
import authController from "./auth.controller.js";
import authValidation from "./auth.validation.js";
import validation from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/register",
  validation.validate(authValidation.registerUser),
  authController.registerUser
);
router.post(
  "/login",
  validation.validate(authValidation.loginUser),
  authController.loginUser
);
router.post("/logout", authController.logoutUser);
router.post(
  "/reset-password",
  auth.userAuthenticate,
  validation.validate(authValidation.resetPassword),
  authController.resetPassword
);

export default router;
