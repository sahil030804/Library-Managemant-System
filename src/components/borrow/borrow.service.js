import BookMdl from "../../models/book.js";
import BorrowMdl from "../../models/borrowing.js";
import helper from "../../utils/helper.js";
import { BORROW_STATUS } from "../../utils/constant.js";

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

    const borrowBook = await BorrowMdl({
      bookId: bookId,
      userId: userId,
      borrowDate: helper.currentDateAndTime(),
      dueDate: helper.calculateDueDate(new Date()),
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
    if (borrowRecordFound.userId.toString() !== req.user._id.toString()) {
      throw new Error("YOU_NOT_BORROWED");
    }
    if (
      borrowRecordFound.returnDate &&
      borrowRecordFound.status === BORROW_STATUS.RETURNED
    ) {
      throw new Error("BOOK_RETURNED");
    }

    await BorrowMdl.findByIdAndUpdate(
      borrowId,
      {
        returnDate: helper.currentDateAndTime(),
        status: BORROW_STATUS.RETURNED,
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
    const borrowedData = await BorrowMdl.findById(borrowId);

    if (borrowedData.userId.toString() !== req.user._id.toString()) {
      throw new Error("YOU_NOT_BORROWED");
    }
    if (!borrowedData) {
      throw new Error("NO_HISTORY");
    }

    if (borrowedData.status === BORROW_STATUS.RETURNED) {
      throw new Error("BOOK_RETURNED");
    }
    const extendTime = await BorrowMdl.findByIdAndUpdate(
      borrowId,
      {
        dueDate: helper.extendDueDate(borrowedData.dueDate),
      },
      { new: true }
    );
    await extendTime.save();

    return { message: "Borrowing period extended successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
};

const borrowHistory = async (req) => {
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

const allMembersOverdueHistory = async (paginationCriteria) => {
  const { page, limit, search } = paginationCriteria;
  const sanitizedSearch = search.trim();
  try {
    const query = {
      $or: [
        { "user.name": { $regex: sanitizedSearch, $options: "i" } },
        { "user.email": { $regex: sanitizedSearch, $options: "i" } },
        { "user.phone": { $regex: sanitizedSearch } },
        { "book.title": { $regex: sanitizedSearch, $options: "i" } },
        { "book.authors": { $regex: sanitizedSearch, $options: "i" } },
        { "book.category": { $regex: sanitizedSearch, $options: "i" } },
      ],
    };
    const skip = (page - 1) * limit;

    let allOverdueBooks = await BorrowMdl.aggregate([
      { $match: { status: BORROW_STATUS.OVERDUE } },
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: query },
      {
        $project: {
          _id: 1,
          borrowDate: 1,
          dueDate: 1,
          returnDate: 1,
          status: 1,
          book: {
            _id: "$book._id",
            title: "$book.title",
            authors: "$book.authors",
            category: "$book.category",
            ISBN: "$book.ISBN",
          },
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
            phone: "$user.phone",
            address: "$user.address",
          },
          fine: 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    if (allOverdueBooks.length === 0) {
      throw new Error("NO_OVERDUES");
    }

    return { history: allOverdueBooks };
  } catch (err) {
    throw new Error(err.message);
  }
};
export default {
  borrowBook,
  returnBook,
  extendBorrowing,
  borrowHistory,
  allMembersOverdueHistory,
};
