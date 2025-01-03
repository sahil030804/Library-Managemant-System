import { CronJob } from "cron";
import BorrowMdl from "../models/borrowing.js";
import { BORROW_STATUS } from "../utils/constant.js";
import env from "../config/index.js";
import { DateTime } from "luxon";

const fineCalculationJob = new CronJob(
  env.job.FINE_CALCULATOR_SCHEDULE,
  async () => {
    try {
      const currentDate = DateTime.now().toFormat("yyyy-MM-dd");

      const pendingBooks = await BorrowMdl.countDocuments({
        returnDate: null,
      });
      if (pendingBooks === 0) {
        return;
      }
      const overDueBooks = await BorrowMdl.find({
        returnDate: null,
        $expr: {
          $lt: [
            { $dateToString: { format: "%Y-%m-%d", date: "$dueDate" } },
            currentDate,
          ],
        },
      });
      const fineValue = env.borrow.FINE;
      for (const book of overDueBooks) {
        const dateDifference = Math.floor(
          (new Date() - book.dueDate) / 1000 / 60 / 60 / 24
        );
        const fine = dateDifference * fineValue;
        if (fine > 0) {
          await BorrowMdl.updateOne(
            { _id: book._id },
            { status: BORROW_STATUS.OVERDUE, fine: fine }
          );
        }
      }
    } catch (err) {
      console.log(`Error during fineCalculation Cron Job : ${err.message}`);
    }
  }
);

export default fineCalculationJob;
