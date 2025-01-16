import UserMdl from "../models/user.js";
import BookMdl from "../models/book.js";
import BorrowMdl from "../models/borrowing.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
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
  const randomdata = crypto.randomBytes(5).toString("hex");
  return `MEM-${randomdata}`;
};

const currentDateAndTime = () => {
  return new Date().toISOString();
};

const calculateDueDate = (borrowedDate) => {
  try {
    const dueDate = new Date(borrowedDate);
    const dueTime = Number(env.borrow.DUE_TIME);
    dueDate.setDate(dueDate.getDate() + dueTime);
    return dueDate;
  } catch (err) {
    throw new Error(err.message);
  }
};

const extendDueDate = (dueDate) => {
  try {
    const extendDueDate = new Date(dueDate);
    const extendTime = Number(env.borrow.EXTEND_TIME);
    extendDueDate.setDate(dueDate.getDate() + extendTime);
    return extendDueDate;
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
  currentDateAndTime,
  calculateDueDate,
  extendDueDate,
};
