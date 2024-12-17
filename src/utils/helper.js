import userMdl from "../models/user.js";
import borrowMdl from "../models/borrowing.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import env from "../config/index.js";

const emailExistingCheck = async (email) => {
  const countEmailExisting = await userMdl.user.countDocuments({ email });

  if (countEmailExisting > 0) {
    return true;
  }
  return false;
};

const userBorrowingCheck = async (userId) => {
  const countUserExisting = await borrowMdl.borrow.countDocuments({ userId });

  if (countUserExisting >= 3) {
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

    const userFound = await userMdl.user.findOne(userId);
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

const calculateDueDate = (borrowedDate) => {
  try {
    const dueDate = new Date(borrowedDate);
    dueDate.setDate(dueDate.getDate() + 14);
    return dueDate;
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};
export default {
  emailExistingCheck,
  userBorrowingCheck,
  encryptPassword,
  decryptPassword,
  generateMembershipId,
  generateAccessAndRefreshToken,
  calculateDueDate,
};
