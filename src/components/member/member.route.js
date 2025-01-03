import express from "express";
import auth from "../../middleware/auth.js";
import memberController from "./member.controller.js";
import validation from "../../middleware/validation.js";
import memberValidation from "./member.validation.js";
import paginationValidate from "../../utils/validation.js";
import { USER_ROLE } from "../../utils/constant.js";
const router = express.Router();

router.post(
  "/",
  auth.isUserLoggedIn,
  auth.accessRole([USER_ROLE.ADMIN]),
  validation.validate(memberValidation.addMember),
  memberController.addMember
);

router.post(
  "/list",
  auth.isUserLoggedIn,
  auth.accessRole([USER_ROLE.ADMIN]),
  validation.validate(paginationValidate),
  memberController.allMembers
);
router.get(
  "/:id",
  auth.isUserLoggedIn,
  auth.accessRole([USER_ROLE.ADMIN]),
  memberController.singleMember
);
router.patch(
  "/toggle-admin",
  auth.isUserLoggedIn,
  auth.accessRole([USER_ROLE.ADMIN]),
  memberController.toggleAdmin
);
router.put(
  "/:id",
  auth.isUserLoggedIn,
  auth.accessRole([USER_ROLE.ADMIN, USER_ROLE.MEMBER]),
  validation.validate(memberValidation.updateMember),
  memberController.updateMember
);
router.post(
  "/history",
  auth.isUserLoggedIn,
  auth.accessRole([USER_ROLE.ADMIN]),
  validation.validate(paginationValidate),
  memberController.viewMembersBorrowHistory
);

export default router;
