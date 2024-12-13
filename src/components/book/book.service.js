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

  let bookFound = await book.findById(bookId);

  if (!bookFound) {
    const error = new Error("BOOK_NOT_FOUND");
    throw error;
  }

  if (title) {
    bookFound.title = title;
  }
  if (authors) {
    bookFound.authors = authors;
  }
  if (ISBN) {
    bookFound.ISBN = ISBN;
  }
  if (category) {
    bookFound.category = category;
  }
  if (publicationYear) {
    bookFound.publicationYear = publicationYear;
  }
  if (totalCopies) {
    bookFound.totalCopies = totalCopies;
  }
  if (shelfNumber) {
    bookFound.shelfNumber = shelfNumber;
  }

  await bookFound.save();
  return { bookFound };
};

export default { addBook, updateBook };
