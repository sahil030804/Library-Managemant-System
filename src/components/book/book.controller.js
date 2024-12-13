import bookService from "./book.service.js";

const addBook = async (req, res, next) => {
  try {
    const bookDetail = await bookService.addBook(req.body);
    res.status(201).json(bookDetail);
  } catch (err) {
    const error = new Error(err.message);
    next(error);
  }
};

export default { addBook };
