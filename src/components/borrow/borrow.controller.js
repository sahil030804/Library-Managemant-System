import borrowService from "./borrow.service.js";

const borrowBook = async (req, res, next) => {
  try {
    const bookBorrowed = await borrowService.borrowBook(req);
    res.status(200).json(bookBorrowed);
  } catch (error) {
    next(error);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const bookReturned = await borrowService.returnBook(req);
    res.status(200).json(bookReturned);
  } catch (error) {
    next(error);
  }
};
const extendBorrowing = async (req, res, next) => {
  try {
    const extendBorrow = await borrowService.extendBorrowing(req);
    res.status(200).json(extendBorrow);
  } catch (error) {
    next(error);
  }
};
const history = async (req, res, next) => {
  try {
    const history = await borrowService.history(req);
    res.status(200).json({ history });
  } catch (error) {
    next(error);
  }
};
const overdueHistory = async (req, res, next) => {
  try {
    const history = await borrowService.overdueHistory(req);
    res.status(200).json({ history });
  } catch (error) {
    next(error);
  }
};

export default {
  borrowBook,
  returnBook,
  extendBorrowing,
  history,
  overdueHistory,
};
