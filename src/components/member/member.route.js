import express from "express";
import auth from "../../middleware/auth.js";
import memberController from "./member.controller.js";
import validation from "../../middleware/validation.js";
import memberValidation from "./member.validation.js";
const router = express.Router();

router.post(
  "/",
  auth.userAuthenticate,
  auth.accessRole(["admin"]),
  validation.validate(memberValidation.memberRegisterValidate),
  memberController.addMember
);

router.get(
  "/",
  auth.userAuthenticate,
  auth.accessRole(["admin"]),
  memberController.allMembers
);
router.get(
  "/:id",
  auth.userAuthenticate,
  auth.accessRole(["admin"]),
  memberController.singleMember
);
router.put(
  "/:id",
  auth.userAuthenticate,
  auth.accessRole(["admin", "member"]),
  validation.validate(memberValidation.memberUpdateValidate),
  memberController.updateMember
);
router.get(
  "/:id/history",
  auth.userAuthenticate,
  auth.accessRole(["admin", "member"]),
  memberController.viewHistory
);

export default router;
