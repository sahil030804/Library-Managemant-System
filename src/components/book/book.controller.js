import bookService from "./book.service.js";

const addBook = async (req, res, next) => {
  try {
    const bookDetail = await bookService.addBook(req.body);
    res.status(201).json(bookDetail);
  } catch (err) {
    next(err);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const bookDetail = await bookService.updateBook(req);
    res.status(200).json(bookDetail);
  } catch (err) {
    next(err);
  }
};

const removeBook = async (req, res, next) => {
  try {
    const bookDelete = await bookService.removeBook(req);
    res.status(200).json(bookDelete);
  } catch (err) {
    next(err);
  }
};
const getAllbooks = async (req, res, next) => {
  try {
    const allBooks = await bookService.getAllBooks(req.body);
    res.status(200).json(allBooks);
  } catch (err) {
    next(err);
  }
};
const getSinglebook = async (req, res, next) => {
  try {
    const singleBook = await bookService.getSingleBook(req);
    res.status(200).json(singleBook);
  } catch (err) {
    next(err);
  }
};

const searchBook = async (req, res, next) => {
  try {
    const searchedBooks = await bookService.searchBook(req);
    res.status(200).json(searchedBooks);
  } catch (err) {
    next(err);
  }
};

const importCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }
    const result = await bookService.importCSV(req.file);
    if (result.errors && result.errors.length > 0) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const exportCSV = async (req, res, next) => {
  try {
    const result = await bookService.exportCSV();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export default {
  addBook,
  updateBook,
  removeBook,
  getAllbooks,
  getSinglebook,
  searchBook,
  importCSV,
  exportCSV,
};
