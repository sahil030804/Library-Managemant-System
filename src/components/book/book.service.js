import BookMdl from "../../models/book.js";
import helper from "../../utils/helper.js";

const addBook = async (reqBody) => {
  const {
    title,
    authors,
    ISBN,
    category,
    publicationYear,
    totalCopies,
    shelfNumber,
  } = reqBody;
  const authorsArr = authors.split(",");

  try {
    const BookExistCheck = await helper.bookExistingCheck(ISBN);

    if (BookExistCheck) {
      throw new Error("BOOK_EXIST");
    }

    const data = await BookMdl({
      title,
      authors: authorsArr,
      ISBN,
      category,
      publicationYear,
      totalCopies,
      availableCopies: totalCopies,
      shelfNumber,
      addedAt: helper.currentDateAndTime(),
      lastUpdated: null,
    });

    const bookData = await data.save();

    const bookDetail = {
      id: bookData._id,
      title: bookData.title,
      authors: bookData.authors,
      ISBN: bookData.ISBN,
      category: bookData.category,
      publicationYear: bookData.publicationYear,
      totalCopies: bookData.totalCopies,
      availableCopies: bookData.availableCopies,
      addedAt: bookData.addedAt,
    };

    return { message: "Book added successfully", bookDetail };
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateBook = async (req) => {
  const bookId = req.params.id;
  const {
    title,
    authors,
    ISBN,
    category,
    publicationYear,
    totalCopies,
    shelfNumber,
  } = req.body;

  if (bookId.length !== 24) {
    throw new Error("INVALID_BOOK_ID");
  }

  const bookFound = await BookMdl.findById(bookId);
  if (!bookFound) {
    throw new Error("BOOK_NOT_FOUND");
  }
  if (bookFound.ISBN !== ISBN) {
    throw new Error("SAME_ISBN");
  }
  const authorsArr = authors.split(",");
  const newAvailableCopies = Math.max(
    bookFound.availableCopies + (totalCopies - bookFound.totalCopies),
    0
  );
  await BookMdl.findByIdAndUpdate(
    bookId,
    {
      title,
      authors: authorsArr,
      ISBN,
      category,
      publicationYear,
      totalCopies,
      availableCopies: newAvailableCopies,
      shelfNumber,
      lastUpdated: helper.currentDateAndTime(),
    },
    { new: true }
  );

  return { message: "Book updated successfully" };
};

const removeBook = async (req) => {
  const bookId = req.params.id;

  try {
    if (bookId.length !== 24) {
      throw new Error("INVALID_BOOK_ID");
    }
    const bookFound = await BookMdl.findById(bookId);
    if (!bookFound) {
      throw new Error("BOOK_NOT_FOUND");
    }
    const bookDeleted = await BookMdl.deleteOne({ _id: bookId });

    if (!bookDeleted.deletedCount == 1) {
      throw new Error("BOOK_NOT_DELETE");
    }

    return { message: "Book Removed Successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
};

const getAllBooks = async (req) => {
  try {
    const { page = 1, limit = 15 } = req.body;
    let filteredBooks = await BookMdl.find();
    if (filteredBooks.length === 0) {
      throw new Error("EMPTY_BOOK_DB");
    }
    const startIndex = (page - 1) * limit;
    const paginatedBooks = filteredBooks.slice(startIndex, startIndex + limit);

    const totalBooks = filteredBooks.length;
    const totalPages = Math.ceil(totalBooks / limit);

    return {
      totalBooks,
      totalPages,
      currentPage: page,
      booksPerPage: limit,
      books: paginatedBooks,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const getSingleBook = async (req) => {
  const bookId = req.params.id;
  try {
    if (bookId.length !== 24) {
      throw new Error("INVALID_BOOK_ID");
    }
    const bookFound = await BookMdl.findById(bookId);
    if (!bookFound) {
      throw new Error("BOOK_NOT_FOUND");
    }
    return bookFound;
  } catch (err) {
    throw new Error(err.message);
  }
};

const searchBook = async (req) => {
  const query = req.query.q.toLowerCase().replaceAll(" ", "");
  try {
    const allBooks = await BookMdl.find();
    const searchedBook = allBooks.filter((book) => {
      if (book.title.toLowerCase().replaceAll(" ", "").includes(query)) {
        return true;
      }
      if (book.category.toLowerCase().replaceAll(" ", "").includes(query)) {
        return true;
      }
      return book.authors.some((author) => {
        return author.toLowerCase().replaceAll(" ", "").includes(query);
      });
    });
    if (searchedBook.length === 0) {
      throw new Error("BOOK_NOT_FOUND");
    }
    return searchedBook;
  } catch (err) {
    throw new Error(err.message);
  }
};

export default {
  addBook,
  updateBook,
  removeBook,
  getAllBooks,
  getSingleBook,
  searchBook,
};
