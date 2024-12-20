import UserMdl from "../models/user.js";
import BookMdl from "../models/book.js";
import BorrowMdl from "../models/borrowing.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import env from "../config/index.js";

const emailExistingCheck = async (email) => {
  const countEmailExisting = await UserMdl.countDocuments({ email });

  if (countEmailExisting > 0) {
    return true;
  }
  return false;
};
const bookExistingCheck = async (ISBN) => {
  const countBookExisting = await BookMdl.countDocuments({ ISBN });

  if (countBookExisting > 0) {
    return true;
  }
  return false;
};

const userBorrowingLimitCheck = async (userId) => {
  const borrowingRecord = await BorrowMdl.find({ userId: userId });
  const currentlyBorrowedBooks = borrowingRecord.filter((record) => {
    return record.status === "borrowed";
  });
  if (currentlyBorrowedBooks.length >= 3) {
    return true;
  }
  return false;
};

const saltRounds = 10;

const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

const comparePassword = (plain, hashed) => {
  return bcrypt.compareSync(plain, hashed);
};

const generateMembershipId = () => {
  const timestamp = Date.now();
  const randomdata = crypto.randomBytes(10).toString("hex");
  return `MEM-${timestamp}-${randomdata}`;
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const accessToken = jwt.sign({ _id: userId }, env.jwt.ACCESS_TOKEN_KEY, {
      expiresIn: env.jwt.ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign({ _id: userId }, env.jwt.REFRESH_TOKEN_KEY, {
      expiresIn: env.jwt.REFRESH_TOKEN_EXPIRY,
    });

    const userFound = await UserMdl.findOne(userId);
    if (!userFound) {
      throw new Error("USER_NOT_FOUND");
    }
    userFound.refreshToken = refreshToken;
    await userFound.save();

    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error(err.message);
  }
};

const currentDateAndTime = () => {
  return new Date().toISOString();
};

const calculateDueDate = (borrowedDate) => {
  try {
    const dueDate = new Date(borrowedDate);
    // console.log(dueDate.toLocaleString());

    const dueTime = Number(env.borrow.DUE_TIME);
    dueDate.setDate(dueDate.getDate() + dueTime);
    // console.log(dueDate.toLocaleString());

    return dueDate;
  } catch (err) {
    throw new Error(err.message);
  }
};

const extendDueDate = (dueDate) => {
  try {
    const extendDueDate = new Date(dueDate);
    // console.log(extendDueDate.toLocaleString());

    const ExtendTime = Number(env.borrow.EXTEND_TIME);

    extendDueDate.setDate(dueDate.getDate() + ExtendTime);
    // console.log(extendDueDate.toLocaleString());

    return extendDueDate;
  } catch (err) {
    throw new Error(err.message);
  }
};

const calculateFine = (dueDate, returnDate) => {
  try {
    const fineValue = env.borrow.FINE;
    const dateDifference = Math.floor((returnDate - dueDate) / 60 / 1000);

    const fine = dateDifference * fineValue;
    if (fine <= 0) {
      return 0;
    }
    return fine;
  } catch (err) {
    throw new Error(err.message);
  }
};
export default {
  emailExistingCheck,
  bookExistingCheck,
  userBorrowingLimitCheck,
  encryptPassword,
  comparePassword,
  generateMembershipId,
  generateAccessAndRefreshToken,
  currentDateAndTime,
  calculateDueDate,
  extendDueDate,
  calculateFine,
};
