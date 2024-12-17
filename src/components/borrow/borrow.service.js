import user from "../../models/user.js";
import book from "../../models/book.js";
import borrow from "../../models/borrowing.js";
import helper from "../../utils/helper.js";

const borrowBook = async (req) => {
  const userId = req.user._id;
  const bookId = req.query.bookId;
  try {
    if (bookId.length !== 24) {
      const error = new Error("INVALID_BOOK_ID");
      throw error;
    }
    const userFound = await user.findById(userId);
    if (userFound.status !== "active") {
      const error = new Error("User have no membership");
      throw error;
    }
    const bookFound = await book.findById(bookId);
    if (!bookFound) {
      const error = new Error("BOOK_NOT_FOUND");
      throw error;
    }
    if (bookFound.availableCopies === 0) {
      const error = new Error("BOOK_NOT_AVAILABLE");
      throw error;
    }

    const userBorrowingCheck = await helper.userBorrowingCheck(userId);

    if (userBorrowingCheck) {
      const error = new Error("BORROW_LIMIT");
      throw error;
    }

    const borrowBook = await borrow({
      bookId: bookId,
      userId: userId,
      borrowDate: new Date().toISOString(),
      dueDate: helper.calculateDueDate(new Date()),
      returnDate: null,
      status: "borrowed",
      fine: 0,
    });
    const bookBorrowed = await borrowBook.save();

    bookFound.availableCopies -= 1;
    await bookFound.save();

    return bookBorrowed;
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};

export default { borrowBook };
