import express from "express";
import authController from "./auth.controller.js";
import authValidation from "./auth.validation.js";
import validation from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/register",
  validation.validate(authValidation.userRegisterValidate),
  authController.registerUser
);
router.post(
  "/login",
  validation.validate(authValidation.userLoginValidate),
  authController.loginUser
);
router.post("/logout", auth.userAuthenticate, authController.logoutUser);
router.post(
  "/reset-password",
  validation.validate(authValidation.resetPasswordValidate),
  authController.resetPassword
);

export default router;
