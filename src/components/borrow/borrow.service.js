import BookMdl from "../../models/book.js";
import BorrowMdl from "../../models/borrowing.js";
import helper from "../../utils/helper.js";
import { BORROW_STATUS } from "../../utils/constant.js";

const currentTime = helper.currentDateAndTime();

const borrowBook = async (req) => {
  const userId = req.user._id;
  const { bookId } = req.body;

  try {
    const userBorrowingCheck = await helper.userBorrowingLimitCheck(userId);

    if (userBorrowingCheck) {
      throw new Error("BORROW_LIMIT");
    }

    if (bookId.length !== 24) {
      throw new Error("INVALID_BOOK_ID");
    }
    const bookFound = await BookMdl.findById(bookId);
    if (!bookFound) {
      throw new Error("BOOK_NOT_FOUND");
    }
    if (bookFound.availableCopies === 0) {
      throw new Error("BOOK_NOT_AVAILABLE");
    }
    const dueDate = helper.calculateDueDate(new Date());
    const borrowBook = await BorrowMdl({
      bookId: bookId,
      userId: userId,
      borrowDate: currentTime,
      dueDate: dueDate,
      returnDate: null,
      status: BORROW_STATUS.BORROWED,
      fine: 0,
    });
    await borrowBook.save();

    bookFound.availableCopies -= 1;
    await bookFound.save();

    return { message: "Book Borrowed Successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
};

const returnBook = async (req) => {
  const { borrowId } = req.body;
  try {
    const borrowRecordFound = await BorrowMdl.findById(borrowId).populate(
      "bookId"
    );

    if (!borrowRecordFound) {
      throw new Error("NO_HISTORY");
    }
    const bookData = borrowRecordFound.bookId;
    if (bookData.availableCopies < bookData.totalCopies) {
      bookData.availableCopies += 1;
      await bookData.save();
    } else {
      throw new Error("BOOK_NOT_BORROWED");
    }
    if (borrowRecordFound.userId.toString() !== req.user._id) {
      throw new Error("YOU_NOT_BORROWED");
    }
    if (
      borrowRecordFound.returnDate &&
      borrowRecordFound.status === BORROW_STATUS.RETURNED
    ) {
      throw new Error("BOOK_RETURNED");
    }

    const dueDate = borrowRecordFound.dueDate;
    const returnDate = new Date();
    const fine = helper.calculateFine(dueDate, returnDate);
    await BorrowMdl.findByIdAndUpdate(
      borrowId,
      {
        returnDate: currentTime,
        status: BORROW_STATUS.RETURNED,
        fine: fine,
      },
      { new: true }
    );

    return { message: "Book Returned Successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
};

const extendBorrowing = async (req) => {
  const { borrowId } = req.body;
  try {
    if (borrowId.length !== 24) {
      throw new Error("INVALID_BORROW_ID");
    }
    const borrowedData = await BorrowMdl.findOne({ _id: borrowId });
    if (borrowedData.userId.toString() !== req.user._id) {
      throw new Error("YOU_NOT_BORROWED");
    }
    if (!borrowedData) {
      throw new Error("NO_HISTORY");
    }

    if (borrowedData.status === BORROW_STATUS.RETURNED) {
      throw new Error("BOOK_RETURNED");
    }
    const extendDueDate = helper.extendDueDate(borrowedData.dueDate);
    const extendTime = await BorrowMdl.findByIdAndUpdate(
      borrowId,
      {
        dueDate: extendDueDate,
      },
      { new: true }
    );
    await extendTime.save();

    return { message: "Borrowing period extended successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
};

const history = async (req) => {
  const userId = req.user._id;
  try {
    const borrowHistory = await BorrowMdl.find({ userId }).populate([
      { path: "bookId", select: "-_id title" },
      { path: "userId", select: "-_id name email phone" },
    ]);
    if (borrowHistory.length === 0) {
      throw new Error("NO_HISTORY");
    }
    return borrowHistory;
  } catch (err) {
    throw new Error(err.message);
  }
};
export default { borrowBook, returnBook, extendBorrowing, history };
