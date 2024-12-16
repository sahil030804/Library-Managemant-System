import express from "express";
import auth from "../../middleware/auth.js";
import memberController from "./member.controller.js";
import validation from "../../middleware/validation.js";
import memberValidation from "./member.validation.js";
const router = express.Router();

router.post(
  "/members",
  auth.userAuthenticate,
  auth.accessRole(["admin"]),
  validation.validate(memberValidation.memberRegisterValidate),
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
router.put(
  "/members/:id",
  auth.userAuthenticate,
  auth.accessRole(["admin", "member"]),
  validation.validate(memberValidation.memberUpdateValidate),
  memberController.updateMember
);

export default router;
