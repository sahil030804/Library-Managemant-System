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

const updateBook = async (req, res, next) => {
  try {
    const bookDetail = await bookService.updateBook(req);
    res.status(201).json(bookDetail);
  } catch (err) {
    const error = new Error(err.message);
    next(error);
  }
};

const RemoveBook = async (req, res, next) => {
  try {
    const bookDelete = await bookService.removeBook(req);
    res.status(201).json(bookDelete);
  } catch (err) {
    const error = new Error(err.message);
    next(error);
  }
};

export default { addBook, updateBook, RemoveBook };
