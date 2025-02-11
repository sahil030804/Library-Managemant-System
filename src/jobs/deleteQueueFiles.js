import { CronJob } from "cron";
import fs from "fs";
import path from "path";
import env from "../config/index.js";

const __dirname = path.dirname(import.meta.dirname);
const mainFolder = path.resolve(__dirname, "..", "CSV_Files");
const oneHourAgo = 60 * 60 * 1000;

const deleteQueueFiles = new CronJob(
  env.job.DELETE_QUEUE_FILES_SCHEDULE,
  async () => {
    try {
      fs.readdir(mainFolder, (err, folders) => {
        folders.forEach((folder) => {
          folder = path.join(mainFolder, folder);
          fs.readdir(folder, (err, files) => {
            if (err) {
              console.log(`error during read folder`, err.message);
              return;
            }
            files.forEach((file) => {
              file = path.join(folder, file);
              fs.stat(file, (err, stats) => {
                if (err) {
                  console.log(`error during read file stats`, err.message);
                  return;
                }
                const fileAge =
                  Date.now() - Math.max(stats.birthtimeMs, stats.mtimeMs);
                if (fileAge > oneHourAgo) {
                  fs.unlink(file, (err) => {
                    if (err) {
                      console.log(`error during deleting file`, err.message);
                      return;
                    }
                    console.log(`File deleted successfully `);
                  });
                }
              });
            });
          });
        });
      });
    } catch (err) {
      console.log(
        `error during deleting files of import export : ${err.message}`
      );
    }
  }
);

export default deleteQueueFiles;
