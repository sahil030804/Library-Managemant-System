import BookMdl from "../../models/book.js";
import helper from "../../utils/helper.js";

const currentTime = helper.currentDateAndTime();

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
      addedAt: currentTime,
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

    return { bookDetail };
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
  const updatedBook = await BookMdl.findByIdAndUpdate(
    bookId,
    {
      title,
      authors: authors.split(","),
      ISBN,
      category,
      publicationYear,
      totalCopies,
      shelfNumber,
      lastUpdated: currentTime,
    },
    { new: true }
  );

  return { updatedBookInfo: updatedBook };
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

const getAllBooks = async () => {
  try {
    const allBooks = await BookMdl.find();
    if (allBooks.length === 0) {
      throw new Error("EMPTY_BOOK_DB");
    }
    return { allBooks };
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
  const query = req.query.q;

  try {
    if (query) {
      const bookFound = await BookMdl.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { authors: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      });

      if (bookFound.length === 0) {
        throw new Error("BOOK_NOT_FOUND");
      }

      return bookFound;
    }
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
