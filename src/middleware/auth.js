import jwt from "jsonwebtoken";
import userMdl from "../models/user.js";
import blacklistMdl from "../models/blacklist.js";
import env from "../config/index.js";

const userAuthenticate = async (req, res, next) => {
  let incomingAccessToken;
  const authToken = req.headers["authorization"];

  if (authToken && authToken.startsWith("Bearer ")) {
    incomingAccessToken = authToken.split(" ")[1];
  }

  try {
    const accessTokenCount = await blacklistMdl.blacklist.countDocuments({
      accessToken: incomingAccessToken,
    });

    if (!incomingAccessToken) {
      const error = new Error("ACCESS_TOKEN_MISSING");
      return next(error);
    }

    jwt.verify(
      incomingAccessToken,
      env.jwt.ACCESS_TOKEN_KEY,
      (err, decodedToken) => {
        if (err) {
          const error = new Error("ACCESS_DENIED");
          return next(error);
        }

        if (accessTokenCount > 0) {
          const error = new Error("ACCESS_DENIED");
          return next(error);
        }
        req.user = decodedToken;
        req.accessToken = incomingAccessToken;
        next();
      }
    );
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      const error = new Error("TOKEN_INVALID");
      return next(error);
    }

    if (err.name === "TokenExpiredError") {
      const error = new Error("ACCESS_TOKEN_EXPIRED");
      return next(error);
    }

    const error = new Error(err.message);
    return next(error);
  }
};

const accessRole = (role) => {
  return async (req, res, next) => {
    const userData = await userMdl.user.findById(req.user._id);
    if (!role.includes(userData.role)) {
      const error = new Error("USER_UNAUTHORIZED");
      return next(error);
    }
    next();
  };
};

const memberStatusCheck = async (req, res, next) => {
  try {
    const userFound = await userMdl.user.findById(req.user._id);

    if (userFound.status !== "active") {
      const error = new Error("ACCOUNT_INACTIVE");
      return next(error);
    }
    next();
  } catch (err) {
    const error = new Error(err.message);
    return next(error);
  }
};
export default { userAuthenticate, accessRole, memberStatusCheck };
