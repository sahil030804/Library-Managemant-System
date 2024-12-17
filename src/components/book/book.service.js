import bookMdl from "../../models/book.js";

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
    const checkBookExist = await bookMdl.book.findOne({ ISBN });
    if (checkBookExist) {
      if (ISBN === checkBookExist.ISBN) {
        const error = new Error("BOOK_EXIST");
        throw error;
      }
    }

    const data = await bookMdl.book({
      title,
      authors: authorsArr,
      ISBN,
      category,
      publicationYear,
      totalCopies,
      availableCopies: totalCopies,
      shelfNumber,
      addedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
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
    const error = new Error(err.message);
    throw error;
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
    const error = new Error("INVALID_BOOK_ID");
    throw error;
  }
  const bookFound = await bookMdl.book.findById(bookId);
  if (!bookFound) {
    const error = new Error("BOOK_NOT_FOUND");
    throw error;
  }

  const updatedBook = await bookMdl.book.findByIdAndUpdate(
    bookId,
    {
      title,
      authors: authors.split(","),
      ISBN,
      category,
      publicationYear,
      totalCopies,
      shelfNumber,
      lastUpdated: new Date().toISOString(),
    },
    { new: true }
  );

  return { updatedBookInfo: updatedBook };
};

const removeBook = async (req) => {
  const bookId = req.params.id;

  try {
    if (bookId.length !== 24) {
      const error = new Error("INVALID_BOOK_ID");
      throw error;
    }
    const bookFound = await bookMdl.book.findById(bookId);
    if (!bookFound) {
      const error = new Error("BOOK_NOT_FOUND");
      throw error;
    }
    const bookDeleted = await bookMdl.book.deleteOne({ _id: bookId });

    if (!bookDeleted.deletedCount == 1) {
      const error = new Error("BOOK_NOT_DELETE");
      throw error;
    }

    return { message: "Book Removed Successfully" };
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};

const getAllBooks = async () => {
  try {
    const allBooks = await bookMdl.book.find();
    if (allBooks.length === 0) {
      const error = new Error("EMPTY_BOOK_DB");
      throw error;
    }
    return { allBooks };
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};

const getSingleBook = async (req) => {
  const bookId = req.params.id;
  try {
    if (bookId.length !== 24) {
      const error = new Error("INVALID_BOOK_ID");
      throw error;
    }
    const bookFound = await bookMdl.book.findById(bookId);
    if (!bookFound) {
      const error = new Error("BOOK_NOT_FOUND");
      throw error;
    }
    return bookFound;
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};

const searchBook = async (req) => {
  const query = req.query.q;

  try {
    if (query) {
      const bookFound = await bookMdl.book.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { authors: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      });

      if (bookFound.length === 0) {
        const error = new Error("BOOK_NOT_FOUND");
        throw error;
      }

      return bookFound;
    }
  } catch (err) {
    const error = new Error(err.message);
    throw error;
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
