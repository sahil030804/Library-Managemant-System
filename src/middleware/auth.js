import UserMdl from "../models/user.js";

const userAuthenticate = async (req, res, next) => {
  try {
    const auth = req.session.user;
    if (!auth) {
      return next(new Error("ACCESS_DENIED"));
    }
    req.user = auth;
    next();
  } catch (err) {
    return next(new Error(err.message));
  }
};

const accessRole = (role) => {
  return async (req, res, next) => {
    const userData = await UserMdl.findById(req.user._id);
    if (!role.includes(userData.role)) {
      return next(new Error("USER_UNAUTHORIZED"));
    }
    next();
  };
};

const memberStatusCheck = async (req, res, next) => {
  try {
    const userFound = await UserMdl.findById(req.user._id);

    if (userFound.status !== "active") {
      return next(new Error("ACCOUNT_INACTIVE"));
    }
    next();
  } catch (err) {
    return next(new Error(err.message));
  }
};
export default { userAuthenticate, accessRole, memberStatusCheck };
