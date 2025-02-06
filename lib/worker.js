import { Worker } from "bullmq";
import config from "../src/config/index.js";
import csv from "fast-csv";
import fs from "fs";
import BookMdl from "../src/models/book.js";

let booksArr = [];
let processedRows = 0;
const importWorker = new Worker(
  "importBooksQueue",

  async (job) => {
    fs.createReadStream(job.data.filePath)
      .pipe(csv.parse({ headers: true }))
      .on("data", async (data) => {
        processedRows++;
        data.authors = data.authors.split(",").map((author) => author.trim());
        booksArr.push(data);
        let progress = Math.round((processedRows / booksArr.length) * 100);
        await job.updateProgress(progress);
      })
      .on("error", (err) => {
        throw new Error(err);
      })
      .on("end", async () => {
        await BookMdl.insertMany(booksArr);
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

importWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

importWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});

importWorker.on("progress", (job) => {
  console.error(`Job ${job.id} is in progress`);
});

export default { importWorker };
