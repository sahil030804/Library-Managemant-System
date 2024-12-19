import borrowService from "./borrow.service.js";

const borrowBook = async (req, res, next) => {
  try {
    const borrowData = await borrowService.borrowBook(req);
    res.status(200).json({ borrowed_Book: borrowData });
  } catch (error) {
    next(error);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const returnData = await borrowService.returnBook(req);
    res.status(200).json({ returned_Book: returnData });
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

export default { borrowBook, returnBook, extendBorrowing };
