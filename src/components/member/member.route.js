import express from "express";
import auth from "../../middleware/auth.js";
import memberController from "./member.controller.js";
import validation from "../../middleware/validation.js";
import memberValidation from "./member.validation.js";
import { USER_ROLE } from "../../utils/constant.js";
const router = express.Router();

router.post(
  "/",
  auth.userAuthenticate,
  auth.accessRole([USER_ROLE.ADMIN]),
  validation.validate(memberValidation.addMember),
  memberController.addMember
);

router.get(
  "/",
  auth.userAuthenticate,
  auth.accessRole([USER_ROLE.ADMIN]),
  memberController.allMembers
);
router.get(
  "/:id",
  auth.userAuthenticate,
  auth.accessRole([USER_ROLE.ADMIN]),
  memberController.singleMember
);
router.put(
  "/:id",
  auth.userAuthenticate,
  auth.accessRole([USER_ROLE.ADMIN, USER_ROLE.MEMBER]),
  validation.validate(memberValidation.updateMember),
  memberController.updateMember
);
router.get(
  "/:id/history",
  auth.userAuthenticate,
  auth.accessRole([USER_ROLE.ADMIN, USER_ROLE.MEMBER]),
  memberController.viewHistory
);

export default router;
