import UserMdl from "../models/user.js";

const isUserLoggedIn = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const userDetail = await UserMdl.findById(userId);
    if (!userId) {
      return next(new Error("ACCESS_DENIED"));
    }
    req.user = userDetail;
    next();
  } catch (err) {
    return next(new Error(err.message));
  }
};

const accessRole = (role) => {
  return async (req, res, next) => {
    const userRole = await UserMdl.findById(req.user._id, "-_id role");
    if (!role.includes(userRole.role)) {
      return next(new Error("USER_UNAUTHORIZED"));
    }
    next();
  };
};

const memberStatusCheck = async (req, res, next) => {
  try {
    const userFound = await UserMdl.findById(req.user._id, "status");

    if (userFound.status !== "active") {
      return next(new Error("ACCOUNT_INACTIVE"));
    }
    next();
  } catch (err) {
    return next(new Error(err.message));
  }
};
export default { isUserLoggedIn, accessRole, memberStatusCheck };
