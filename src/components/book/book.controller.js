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
    res.status(200).json(bookDetail);
  } catch (err) {
    const error = new Error(err.message);
    next(error);
  }
};

const RemoveBook = async (req, res, next) => {
  try {
    const bookDelete = await bookService.removeBook(req);
    res.status(200).json(bookDelete);
  } catch (err) {
    const error = new Error(err.message);
    next(error);
  }
};
const getAllbooks = async (req, res, next) => {
  try {
    const allBooks = await bookService.getAllBooks();
    res.status(200).json(allBooks);
  } catch (err) {
    const error = new Error(err.message);
    next(error);
  }
};
const getSinglebook = async (req, res, next) => {
  try {
    const singleBook = await bookService.getSingleBook(req);
    res.status(200).json({ Book: singleBook });
  } catch (err) {
    const error = new Error(err.message);
    next(error);
  }
};

const searchBook = async (req, res, next) => {
  try {
    const searchedBooks = await bookService.searchBook(req);
    res.status(200).json({ SearchedBooks: searchedBooks });
  } catch (err) {
    const error = new Error(err.message);
    next(error);
  }
};

export default {
  addBook,
  updateBook,
  RemoveBook,
  getAllbooks,
  getSinglebook,
  searchBook,
};
