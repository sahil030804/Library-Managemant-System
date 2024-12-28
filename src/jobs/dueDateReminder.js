import { CronJob } from "cron";
import BorrowMdl from "../models/borrowing.js";
import dueDateReminderTemplate from "../mailTemplates/reminderTemplate.js";
import sendMail from "../utils/emailService.js";
import env from "../config/index.js";

const dueDateReminder = new CronJob(
  env.job.DUE_DATE_REMINDER_SCHEDULE,
  async () => {
    try {
      const tommorrow = new Date();
      tommorrow.setDate(tommorrow.getDate() + 1);
      tommorrow.setHours(0, 0, 0, 0);
      const endOfTomorrow = new Date(tommorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);

      const allBorrows = await BorrowMdl.find({
        status: "borrowed",
        dueDate: { $gte: tommorrow, $lte: endOfTomorrow },
      }).populate([
        {
          path: "bookId",
          select: "-_id title",
        },
        {
          path: "userId",
          select: "-_id name email",
        },
      ]);

      if (allBorrows.length === 0) {
        dueDateReminder.stop();
      }
      allBorrows.forEach((borrow) => {
        const emailContent = dueDateReminderTemplate(
          borrow.userId.name,
          borrow.bookId.title,
          borrow.dueDate.toDateString()
        );
        sendMail(
          borrow.userId.email,
          "Library Due Date Reminder",
          "",
          emailContent
        );
      });
    } catch (err) {
      return new Error(err.message);
    }
  }
);

export default dueDateReminder;
