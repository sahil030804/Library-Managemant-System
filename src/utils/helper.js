import user from "../models/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import env from "../../config.js";

const emailExistingCheck = async (email) => {
  const countEmailExisting = await user.countDocuments({ email });

  if (countEmailExisting > 0) {
    return true;
  }
  return false;
};

const saltRounds = 10;

const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

const decryptPassword = (plain, hashed) => {
  return bcrypt.compareSync(plain, hashed);
};

const generateMembershipId = () => {
  const timestamp = Date.now();
  const randomdata = crypto.randomBytes(10).toString("hex");
  return `MEM-${timestamp}-${randomdata}`;
};

const generateAccessAndRefreshToken = async (userId, role) => {
  try {
    const accessToken = jwt.sign(
      { _id: userId, role: role },
      env.jwt.ACCESS_TOKEN_KEY,
      { expiresIn: env.jwt.ACCESS_TOKEN_EXPIRY }
    );
    const refreshToken = jwt.sign(
      { _id: userId, role: role },
      env.jwt.REFRESH_TOKEN_KEY,
      { expiresIn: env.jwt.REFRESH_TOKEN_EXPIRY }
    );

    const userFound = await user.findOne(userId);
    if (!userFound) {
      const error = new Error("USER_NOT_FOUND");
      throw error;
    }
    userFound.refreshToken = refreshToken;
    await userFound.save();

    return { accessToken, refreshToken };
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};
export default {
  emailExistingCheck,
  encryptPassword,
  decryptPassword,
  generateMembershipId,
  generateAccessAndRefreshToken,
};
