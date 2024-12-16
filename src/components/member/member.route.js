import express from "express";
import auth from "../../middleware/auth.js";
import memberController from "./member.controller.js";
import validation from "../../middleware/validation.js";
import memberRegisterValidate from "./member.validation.js";
const router = express.Router();

router.post(
  "/members",
  auth.userAuthenticate,
  auth.accessRole(["admin"]),
  validation.validate(memberRegisterValidate),
  memberController.addMember
);

router.get(
  "/members",
  auth.userAuthenticate,
  auth.accessRole(["admin"]),
  memberController.allMembers
);
router.get(
  "/members/:id",
  auth.userAuthenticate,
  auth.accessRole(["admin"]),
  memberController.singleMember
);

export default router;
