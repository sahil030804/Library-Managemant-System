import bookMdl from "../../models/book.js";
import borrowMdl from "../../models/borrowing.js";
import helper from "../../utils/helper.js";

const borrowBook = async (req) => {
  const userId = req.user._id;
  const { bookId } = req.body;
  console.log(bookId);

  try {
    const userBorrowingCheck = await helper.userBorrowingLimitCheck(userId);

    if (userBorrowingCheck) {
      const error = new Error("BORROW_LIMIT");
      throw error;
    }

    if (bookId.length !== 24) {
      const error = new Error("INVALID_BOOK_ID");
      throw error;
    }
    const bookFound = await bookMdl.book.findById(bookId);
    if (!bookFound) {
      const error = new Error("BOOK_NOT_FOUND");
      throw error;
    }
    if (bookFound.availableCopies === 0) {
      const error = new Error("BOOK_NOT_AVAILABLE");
      throw error;
    }

    const borrowBook = await borrowMdl.borrow({
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

const returnBook = async (req) => {
  const { borrowId } = req.body;
  try {
    const borrowRecordFound = await borrowMdl.borrow
      .findById(borrowId)
      .populate("bookId");

    if (!borrowRecordFound) {
      const error = new Error("NO_HISTORY");
      throw error;
    }
    const bookData = borrowRecordFound.bookId;
    if (bookData.availableCopies < bookData.totalCopies) {
      bookData.availableCopies += 1;
      await bookData.save();
    } else {
      const error = new Error("BOOK_NOT_BORROWED");
      throw error;
    }
    if (borrowRecordFound.userId.toString() !== req.user._id) {
      const error = new Error("YOU_NOT_BORROWED");
      throw error;
    }
    if (
      borrowRecordFound.returnDate &&
      borrowRecordFound.status === "returned"
    ) {
      const error = new Error("BOOK_RETURNED");
      throw error;
    }

    const dueDate = borrowRecordFound.dueDate;
    const returnDate = new Date();
    const fine = helper.calculateFine(dueDate, returnDate);
    const bookReturned = await borrowMdl.borrow.findByIdAndUpdate(
      borrowId,
      {
        returnDate: new Date().toISOString(),
        status: "returned",
        fine: fine,
      },
      { new: true }
    );

    return bookReturned;
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};

const extendBorrowing = async (req) => {
  const { borrowId } = req.body;
  try {
    if (borrowId.length !== 24) {
      const error = new Error("INVALID_BORROW_ID");
      throw error;
    }
    const borrowedData = await borrowMdl.borrow.findOne({ _id: borrowId });
    if (borrowedData.userId.toString() !== req.user._id) {
      const error = new Error("This book is not borrowed by you");
      throw error;
    }
    if (!borrowedData) {
      const error = new Error("NO_HISTORY");
      throw error;
    }
    const extendTime = await borrowMdl.borrow.findByIdAndUpdate(
      borrowId,
      {
        dueDate: helper.extendDueDate(borrowedData.dueDate),
      },
      { new: true }
    );
    const borrowingExtended = await extendTime.save();

    return borrowingExtended;
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};
export default { borrowBook, returnBook, extendBorrowing };
