import { Worker } from "bullmq";
import config from "../src/config/index.js";
import csv from "fast-csv";
import fs from "fs";
import path from "path";
import BookMdl from "../src/models/book.js";
import helper from "../src/utils/helper.js";

let booksArr = [];
const importWorker = new Worker(
  "importBooksQueue",

  async (job) => {
    let processedRows = 0;
    let lastReportedProgress = 0;
    fs.createReadStream(job.data.filePath)
      .pipe(csv.parse({ headers: true }))
      .on("data", async (data) => {
        processedRows++;
        data.authors = data.authors.split(",").map((author) => author.trim());
        data.availableCopies = data.totalCopies;
        data.addedAt = helper.currentDateAndTime();
        data.lastUpdated = helper.currentDateAndTime();

        booksArr.push(data);
        const currentProgress = Math.round(
          (processedRows / job.data.totalRows) * 100
        );
        const roundedProgress = Math.ceil(currentProgress / 10) * 10; // Rounds up to the next multiple of 10

        if (roundedProgress > lastReportedProgress && roundedProgress <= 100) {
          lastReportedProgress = roundedProgress;
          await job.updateProgress(roundedProgress);
        }
      })
      .on("error", (err) => {
        throw new Error(err);
      })
      .on("end", async () => {
        await BookMdl.insertMany(booksArr);
        fs.unlink(job.data.filePath, (err) => {
          if (err) throw err;
          console.log(`File deleted successfully`);
        });
      });
  },
  {
    connection: {
      host: config.redis.REDIS_HOST,
      port: config.redis.REDIS_PORT,
      password: config.redis.REDIS_PASSWORD,
    },
  }
);

const exportWoker = new Worker(
  "exportBooksQueue",

  async (job) => {
    let processedRows = 0;
    let lastReportedProgress = 0;

    const allBooks = await BookMdl.find();
    const csvStream = csv.format({ headers: true });
    const fileStream = fs.createWriteStream(job.data.filePath);

    csvStream.pipe(fileStream);

    if (allBooks.length > 0) {
      allBooks.forEach(async (book) => {
        processedRows++;
        csvStream.write({
          ISBN: book.ISBN,
          title: book.title,
          authors: book.authors,
          category: book.category,
          publicationYear: book.publicationYear,
          totalCopies: book.totalCopies,
          availableCopies: book.availableCopies,
          shelfNumber: book.shelfNumber,
          addedAt: book.addedAt.toLocaleString(),
          lastUpdated: book.lastUpdated.toLocaleString(),
        });

        const currentProgress = Math.round(
          (processedRows / allBooks.length) * 100
        );
        const roundedProgress = Math.ceil(currentProgress / 10) * 10; // Rounds up to the next multiple of 10

        if (roundedProgress > lastReportedProgress && roundedProgress <= 100) {
          lastReportedProgress = roundedProgress;
          await job.updateProgress(roundedProgress);
        }
      });
    }
    csvStream.end();
    fileStream.on("finish", () => {
      console.log("File successfully generated");
    });
  },
  {
    connection: {
      host: config.redis.REDIS_HOST,
      port: config.redis.REDIS_PORT,
      password: config.redis.REDIS_PASSWORD,
    },
  }
);

//import job worker log
importWorker.on("completed", (job) => {
  console.log(`Import Job ${job.id} completed`);
});

importWorker.on("failed", (job, err) => {
  console.error(`Import Job ${job.id} failed with error: ${err.message}`);
});

//export job worker log

exportWoker.on("completed", (job) => {
  console.log(`Export Job ${job.id} completed`);
});

exportWoker.on("failed", (job, err) => {
  console.error(`Export Job ${job.id} failed with error: ${err.message}`);
});

// importWorker.on("progress", (job, progress) => {
//   console.error(`Job ${job.id} is in progress ${progress}`);
// });

export default { importWorker, exportWoker };
