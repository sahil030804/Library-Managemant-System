import jwt from "jsonwebtoken";
import UserMdl from "../models/user.js";
import BlacklistMdl from "../models/blacklist.js";
import env from "../config/index.js";

const userAuthenticate = async (req, res, next) => {
  let incomingAccessToken;
  const authToken = req.headers["authorization"];

  if (authToken && authToken.startsWith("Bearer ")) {
    incomingAccessToken = authToken.split(" ")[1];
  }

  try {
    const accessTokenCount = await BlacklistMdl.countDocuments({
      accessToken: incomingAccessToken,
    });

    if (!incomingAccessToken) {
      return next(new Error("ACCESS_TOKEN_MISSING"));
    }

    jwt.verify(
      incomingAccessToken,
      env.jwt.ACCESS_TOKEN_KEY,
      (err, decodedToken) => {
        if (err) {
          return next(new Error("ACCESS_DENIED"));
        }

        if (accessTokenCount > 0) {
          return next(new Error("ACCESS_DENIED"));
        }
        req.user = decodedToken;
        req.accessToken = incomingAccessToken;
        next();
      }
    );
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return next(new Error("TOKEN_INVALID"));
    }

    if (err.name === "TokenExpiredError") {
      return next(new Error("ACCESS_TOKEN_EXPIRED"));
    }
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
