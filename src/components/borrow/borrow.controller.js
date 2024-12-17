import borrowService from "./borrow.service.js";

const borrowBook = async (req, res, next) => {
  try {
    const borrowData = await borrowService.borrowBook(req);
    res.status(200).json({ borrowed_Book: borrowData });
  } catch (error) {
    next(error);
  }
};

export default { borrowBook };
