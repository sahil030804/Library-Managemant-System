import book from "../../models/book.js";

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
    const checkBookExist = await book.findOne({ ISBN });
    if (checkBookExist) {
      if (ISBN === checkBookExist.ISBN) {
        const error = new Error("BOOK_EXIST");
        throw error;
      }
    }

    const data = await book({
      title,
      authors: authorsArr,
      ISBN,
      category,
      publicationYear,
      totalCopies,
      availableCopies: totalCopies,
      shelfNumber,
      addedAt: new Date().toISOString(),
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
  const bookFound = await book.findById(bookId);
  if (!bookFound) {
    const error = new Error("BOOK_NOT_FOUND");
    throw error;
  }

  const updatedBook = await book.findByIdAndUpdate(
    bookId,
    {
      title,
      authors: authors.split(","),
      ISBN,
      category,
      publicationYear,
      totalCopies,
      shelfNumber,
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
    const bookFound = await book.findById(bookId);
    if (!bookFound) {
      const error = new Error("BOOK_NOT_FOUND");
      throw error;
    }
    const bookDeleted = await book.deleteOne({ _id: bookId });

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
export default { addBook, updateBook, removeBook };
