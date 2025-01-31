import BookMdl from "../../models/book.js";
import helper from "../../utils/helper.js";
import redisHelper from "../../utils/redisHelper.js";

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
  const authorsArr = authors.split(",").map((author) => author.trim());

  try {
    const bookExistCheck = await helper.bookExistingCheck(ISBN);

    if (bookExistCheck) {
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

  const bookKey = `BookList:Book:${bookId}`;
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
  const book = await BookMdl.findByIdAndUpdate(
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

  await redisHelper.setBookData(bookKey, book);

  return { message: "Book updated successfully" };
};

const removeBook = async (req) => {
  const bookId = req.params.id;
  const bookKey = `BookList:Book:${bookId}`;
  try {
    if (bookId.length !== 24) {
      throw new Error("INVALID_BOOK_ID");
    }
    const bookFound = await BookMdl.findById(bookId);
    if (!bookFound) {
      throw new Error("BOOK_NOT_FOUND");
    }
    const bookDeleted = await BookMdl.deleteOne({ _id: bookId });
    await redisHelper.deleteBookData(bookKey);

    if (!bookDeleted.deletedCount == 1) {
      throw new Error("BOOK_NOT_DELETE");
    }

    return { message: "Book Removed Successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
};

const getAllBooks = async (paginationCriteria) => {
  const { page, limit, search } = paginationCriteria;
  const sanitizedSearch = search.trim();
  try {
    const query = {
      $or: [
        {
          title: { $regex: sanitizedSearch, $options: "i" },
        },
        {
          authors: {
            $regex: sanitizedSearch,
            $options: "i",
          },
        },
        {
          category: {
            $regex: sanitizedSearch,
            $options: "i",
          },
        },
      ],
    };

    const options = {
      limit: limit,
      skip: (page - 1) * limit,
    };
    let filteredBooks = await BookMdl.find(query, null, options);
    if (filteredBooks.length === 0) {
      throw new Error("EMPTY_BOOK_DB");
    }

    return {
      books: filteredBooks,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const getSingleBook = async (req) => {
  const bookId = req.params.id;
  const bookKey = `BookList:Book:${bookId}`;
  try {
    if (bookId.length !== 24) {
      throw new Error("INVALID_BOOK_ID");
    }
    const data = await redisHelper.getBookData(bookKey);

    if (data) {
      return { message: "fetch from redis cache", book: data };
    }
    const book = await BookMdl.findById(bookId);
    if (!book) {
      throw new Error("BOOK_NOT_FOUND");
    }
    await redisHelper.setBookData(bookKey, book);
    return { message: "fetch from database", book };
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
    const bookKey = `BookList:Book:${searchedBook._id}`;
    await redisHelper.setBookData(bookKey, searchedBook);
    return { searchedBook };
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
