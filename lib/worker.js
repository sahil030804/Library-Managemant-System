import { Worker } from "bullmq";
import config from "../src/config/index.js";
import csv from "fast-csv";
import fs from "fs";
import path from "path";
import BookMdl from "../src/models/book.js";
import helper from "../src/utils/helper.js";

// let booksArr = [];
// let errors = []; //store error

// let rowNumber = 1;
// let processingPromises = []; //store processed promise of row validation[GPT]
// const importWorker = new Worker(
//   "importBooksQueue",

//   async (job) => {
//     fs.existsSync(job.data.filePath, (exists) => {
//       console.log(exists ? "Found" : "Not found!");
//     });

//     let processedRows = 0;
//     let lastReportedProgress = 0;

//     await new Promise((resolve, reject) => {
//       fs.createReadStream(job.data.filePath)
//         .pipe(csv.parse({ headers: true }))
//         .on("data", async (data) => {
//           rowNumber++;
//           const currentRowNumber = rowNumber;

//           const processRow = async () => {
//             try {
//               // ISBN validation
//               if (!data.ISBN) {
//                 errors.push({
//                   row: currentRowNumber,
//                   column: `ISBN`,
//                   error: `ISBN is required`,
//                 });
//               } else if (!/^978-\d{1,5}-\d{1,7}-\d{1,7}-\d$/.test(data.ISBN)) {
//                 errors.push({
//                   row: currentRowNumber,
//                   column: `ISBN`,
//                   error: `Row ${currentRowNumber}: Invalid ISBN format, found: ${data.ISBN}`,
//                 });
//               } else {
//                 const isISBNDuplicate = await helper.bookExistingCheck(
//                   data.ISBN
//                 );
//                 if (isISBNDuplicate) {
//                   errors.push({
//                     row: currentRowNumber,
//                     column: `ISBN`,
//                     error: `Row ${currentRowNumber}: Book already exists with ISBN ${data.ISBN}`,
//                   });
//                 }
//               }

//               // Publication year validation
//               if (!data.publicationYear) {
//                 errors.push({
//                   row: currentRowNumber,
//                   column: `Publication year`,
//                   error: `Row ${currentRowNumber}: Publication year is required`,
//                 });
//               } else if (!/^\d{4}$/.test(data.publicationYear)) {
//                 errors.push({
//                   row: currentRowNumber,
//                   column: `Publication year`,
//                   error: `Row ${currentRowNumber}: Publication year must be 4 digits, found: ${data.publicationYear}`,
//                 });
//               }
//             } catch (error) {
//               errors.push({
//                 row: currentRowNumber,
//                 column: `Processing`,
//                 error: `Row ${currentRowNumber}: Error processing row - ${error.message}`,
//               });
//             }
//           };

//           processingPromises.push(processRow()); // Store the promise for this row[GPT]

//           processedRows++;
//           data.authors = data.authors.split(",").map((author) => author.trim());
//           data.availableCopies = data.totalCopies;
//           data.addedAt = helper.currentDateAndTime();
//           data.lastUpdated = helper.currentDateAndTime();

//           booksArr.push(data);
//           const currentProgress = Math.round(
//             (processedRows / job.data.totalRows) * 100
//           );
//           const roundedProgress = Math.ceil(currentProgress / 10) * 10; // Rounds up to the next multiple of 10

//           if (
//             roundedProgress > lastReportedProgress &&
//             roundedProgress <= 100
//           ) {
//             lastReportedProgress = roundedProgress;
//             await job.updateProgress(roundedProgress);
//           }
//           await job.extendLock(job.token, 1200000);
//         })
//         .on("error", (err) => {
//           // throw new Error(err);
//           reject(err);
//         })
//         .on("end", async () => {
//           await Promise.all(processingPromises); //stop exection for all promise to be proccess [GPT]
//           console.log(`total errors`, errors.length);

//           errors.sort((a, b) => {
//             return a.row - b.row;
//           });

//           // await BookMdl.insertMany(booksArr);
//           let hasError = false;
//           if (errors.length > 0) {
//             hasError = true;
//           }
//           console.log(`errors`, errors);

//           if (hasError) {
//             await job.updateData({ ...job.data, errors });
//             await job.extendLock(job.token, 5 * 60 * 1000);
//             await job.moveToFailed(
//               new Error("my error message"),
//               job.token,
//               true
//             );
//             return console.log(`move to failed and add error successfully`);
//           }

//           fs.unlink(job.data.filePath, (err) => {
//             if (err) return err;
//             console.log(
//               `JobId${job.id}-${job.data.filePath} File deleted successfully`
//             );
//           });
//           console.log(`need to move to failed`, hasError);
//           resolve();
//         });
//     });
//     // });
//   },
//   {
//     connection: {
//       host: config.redis.REDIS_HOST,
//       port: config.redis.REDIS_PORT,
//       password: config.redis.REDIS_PASSWORD,
//     },
//     lockDuration: 5 * 60 * 1000,
//     concurrency: 1,
//   }
// );
// let rowNumber = 1;
// console.log(`row number start`, rowNumber);

let errors = [];
let booksArr = [];
// let processingPromises = [];

// Function to validate data
const validateData = async (data, currentRowNumber) => {
  let rowErrors = [];
  try {
    if (!data.ISBN) {
      rowErrors.push({
        row: currentRowNumber,
        column: "ISBN",
        error: "ISBN is required",
      });
    } else if (!/^978-\d{1,5}-\d{1,7}-\d{1,7}-\d$/.test(data.ISBN)) {
      rowErrors.push({
        row: currentRowNumber,
        column: "ISBN",
        error: `Invalid ISBN format: ${data.ISBN}`,
      });
    } else {
      const isDuplicate = await helper.bookExistingCheck(data.ISBN);
      if (isDuplicate) {
        rowErrors.push({
          row: currentRowNumber,
          column: "ISBN",
          error: `Book already exists with ISBN: ${data.ISBN}`,
        });
      }
    }

    if (!data.publicationYear) {
      rowErrors.push({
        row: currentRowNumber,
        column: "Publication Year",
        error: "Publication year is required",
      });
    } else if (!/^\d{4}$/.test(data.publicationYear)) {
      rowErrors.push({
        row: currentRowNumber,
        column: "Publication Year",
        error: `Invalid year: ${data.publicationYear}`,
      });
    }

    if (rowErrors.length === 0) {
      data.authors = data.authors.split(",").map((author) => author.trim());
      data.availableCopies = data.totalCopies;
      data.addedAt = helper.currentDateAndTime();
      data.lastUpdated = helper.currentDateAndTime();
      booksArr.push(data);
    } else {
      errors.push(...rowErrors);
      rowErrors.length = 0;
    }
  } catch (error) {
    errors.push({
      row: currentRowNumber,
      column: "Processing",
      error: `Error processing row: ${error.message}`,
    });
  }
};
// Function to process a batch
const processBatch = async (batch) => {
  await Promise.allSettled(
    batch.map(({ data, currentRowNumber }) =>
      validateData(data, currentRowNumber)
    )
  );
};

const importWorker = new Worker(
  "importBooksQueue",
  async (job) => {
    try {
      let rowNumber = 1;
      let processedRows = 0;
      let lastReportedProgress = 0;
      let processingPromises = [];
      const BATCH_SIZE = 100;

      const filePath = job.data.filePath;
      if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filePath}`);
        await job.remove();
        return;
      }
      console.log(`✅ File found: ${filePath}`);

      let batch = [];
      const autoExtendLock = setInterval(async () => {
        try {
          if (await job.isActive()) {
            await job.extendLock(job.token, 60 * 1000);
          }
        } catch (e) {
          console.error("Failed to extend job lock:", e.message);
        }
      }, 50 * 1000);

      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv.parse({ headers: true }))
          .on("data", async (data) => {
            rowNumber++;
            const currentRowNumber = rowNumber;
            batch.push({ data, currentRowNumber });

            if (batch.length >= BATCH_SIZE) {
              processingPromises.push(processBatch(batch));
              batch.length = 0;
            }

            processedRows++;
            const currentProgress = Math.round(
              (processedRows / job.data.totalRows) * 100
            );
            if (currentProgress >= lastReportedProgress + 10) {
              lastReportedProgress = currentProgress;
              await job.updateProgress(currentProgress);
            }
          })
          .on("error", (err) => reject(err))
          .on("end", async () => {
            if (batch.length > 0) {
              processingPromises.push(processBatch(batch));
            }
            await Promise.all(processingPromises);
            processingPromises.length = 0;
            fs.unlink(filePath, (err) => {
              if (err) console.error(`❌ Error deleting file: ${err.message}`);
              else console.log(`✅ File deleted: ${filePath}`);
            });
            console.log(`error found`, errors.length);
            if (errors.length > 0) {
              errors.sort((a, b) => a.row - b.row);
              await job.updateData({ ...job.data, errors });
              errors.length = 0;
              await job.moveToFailed(
                new Error(`Validation Error`),
                job.token,
                true
              );
            } else {
              await BookMdl.insertMany(booksArr);
              booksArr.length = 0;
              console.log("✅ Processing complete!");
            }

            clearInterval(autoExtendLock);
            resolve();
          });
      });
    } catch (err) {
      console.error(`🚨 Job processing failed: ${err}`);
      await job.moveToFailed(new Error(err.message), job.token, true);
    }
  },
  {
    connection: {
      host: config.redis.REDIS_HOST,
      port: config.redis.REDIS_PORT,
      password: config.redis.REDIS_PASSWORD,
    },
    lockDuration: 10 * 60 * 1000,
    concurrency: 1, // Increase concurrency for faster processing
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
importWorker.on("active", (job) => {
  console.log(
    `Job ${job.id} is currently being processed by worker: ${importWorker.name}`
  );
});

importWorker.on("completed", (job) => {
  console.error(`✅ Job ${job.id} completed`);
});

importWorker.on("failed", (job, err) => {
  console.log(`❌ Job ${job.id} failed: ${err.message}`);
});

importWorker.on("progress", (job, progress) => {
  console.log(`Job ${job.id} is in progress ${progress}`);
});

//export job worker log

exportWoker.on("completed", (job) => {
  console.log(`Export Job ${job.id} completed`);
});

exportWoker.on("failed", (job, err) => {
  console.error(`Export Job ${job.id} failed with error: ${err.message}`);
});

export default { importWorker, exportWoker };
