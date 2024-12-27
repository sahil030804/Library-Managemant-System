import { CronJob } from "cron";
import BorrowMdl from "../models/borrowing.js";
import env from "../config/index.js";

const fineCalculationJob = new CronJob("0 0 * * *", async () => {
  try {
    const pendingBooks = await BorrowMdl.countDocuments({
      returnDate: null,
    });
    if (pendingBooks === 0) {
      fineCalculationJob.stop();
      return;
    }
    const overDueBooks = await BorrowMdl.find({
      returnDate: null,
      dueDate: { $lt: new Date() },
    });
    const fineValue = env.borrow.FINE;

    for (const book of overDueBooks) {
      const dateDifference = Math.floor((new Date() - book.dueDate) / 1000);
      const fine = dateDifference * fineValue;
      if (fine > 0) {
        await BorrowMdl.updateOne({ _id: book._id }, { fine: fine });
      }
    }
  } catch (err) {
    return next(new Error(err.message));
  }
});

export default fineCalculationJob;
