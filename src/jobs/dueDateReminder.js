import { CronJob } from "cron";
import BorrowMdl from "../models/borrowing.js";
import dueDateReminderTemplate from "../mailTemplates/reminderTemplate.js";
import sendMail from "../utils/emailService.js";
import env from "../config/index.js";
import { DateTime } from "luxon";

const dueDateReminder = new CronJob(
  env.job.DUE_DATE_REMINDER_SCHEDULE,
  async () => {
    try {
      const nextDay = DateTime.now().toFormat("yyyy-MM-dd");

      const allBorrows = await BorrowMdl.find({
        status: "borrowed",
        $expr: {
          $eq: [
            {
              $dateToString: { format: "%Y-%m-%d", date: "$dueDate" },
            },
            nextDay,
          ],
        },
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
        return;
      }
      const userBorrows = {};
      allBorrows.forEach((borrow) => {
        const userEmail = borrow.userId.email;
        if (!userBorrows[userEmail]) {
          userBorrows[userEmail] = {
            name: borrow.userId.name,
            books: [],
          };
        }
        userBorrows[userEmail].books.push({
          title: borrow.bookId.title,
          dueDate: borrow.dueDate.toDateString(),
        });
      });

      for (const [email, userInfo] of Object.entries(userBorrows)) {
        const emailContent = dueDateReminderTemplate({
          username: userInfo.name,
          books: userInfo.books,
        });
        sendMail(email, "Library Due Date Reminder", "", emailContent);
      }
    } catch (err) {
      console.log(`Error during dueDateReminder Cron Job : ${err.message}`);
    }
  }
);

export default dueDateReminder;
