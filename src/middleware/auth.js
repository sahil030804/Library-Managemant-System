import jwt from "jsonwebtoken";
import auth from "../config/auth.js";

const userAuthenticate = async (req, res, next) => {
  let incomingAccessToken;
  const authToken = req.headers["authorization"];

  if (authToken && authToken.startsWith("Bearer ")) {
    incomingAccessToken = authToken.split(" ")[1];
  }

  try {
    if (!incomingAccessToken) {
      const error = new Error("ACCESS_TOKEN_MISSING");
      return next(error);
    }

    jwt.verify(
      incomingAccessToken,
      auth.jwt.ACCESS_TOKEN_KEY,
      (err, decodedToken) => {
        if (err) {
          const error = new Error("ACCESS_DENIED");
          return next(error);
        }
        req.user = decodedToken;
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
    if (!role.includes(req.user.role)) {
      const error = new Error("USER_UNAUTHORIZED");
      return next(error);
    }
    next();
  };
};
export default { userAuthenticate, accessRole };
