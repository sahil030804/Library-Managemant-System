import express from "express";
import authController from "./auth.controller.js";
import authValidation from "./auth.validation.js";
import validation from "../../middleware/validation.js";

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

export default router;
