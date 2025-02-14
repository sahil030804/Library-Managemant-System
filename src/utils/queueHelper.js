import { Queue } from "bullmq";
import config from "../config/index.js";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js"; // Use BullMQAdapter instead of BullAdapter
import { ExpressAdapter } from "@bull-board/express";

const importQueue = new Queue("importBooksQueue", {
  connection: {
    host: config.redis.REDIS_HOST,
    port: config.redis.REDIS_PORT,
    password: config.redis.REDIS_PASSWORD,
  },
});

const exportQueue = new Queue("exportBooksQueue", {
  connection: {
    host: config.redis.REDIS_HOST,
    port: config.redis.REDIS_PORT,
    password: config.redis.REDIS_PASSWORD,
  },
});

//import logs
importQueue.on("waiting", ({ id }) => {
  console.log(`import Job ${id} is waiting in the queue`);
});

importQueue.on("failed", ({ id, failedReason }) => {
  console.error(`import Job ${id} failed due to: ${failedReason}`);
});

importQueue.on("completed", ({ id }) => {
  console.log(`import Job ${id} completed`);
});

importQueue.on("paused", ({ id }) => {
  console.log(`import Job ${id} paused`);
});

//export logs
exportQueue.on("waiting", ({ id }) => {
  console.log(`export Job ${id} is waiting in the queue`);
});

exportQueue.on("failed", ({ id, failedReason }) => {
  console.error(`export Job ${id} failed due to: ${failedReason}`);
});

exportQueue.on("completed", ({ id }) => {
  console.log(`export Job ${id} completed`);
});

exportQueue.on("paused", ({ id }) => {
  console.log(`export Job ${id} paused`);
});

class Queues {
  async addImportJob(filePath, totalRows) {
    const job = await importQueue.add(
      "importBooksJob",
      { filePath, totalRows },
      { attempts: 3 }
    );

    return job;
  }
  async addExportJob(filePath, filter) {
    const job = await exportQueue.add(
      "exportBooksJob",
      { filter, filePath },
      { attempts: 3 }
    );
    return job;
  }
}
// Create Express Adapter for UI
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

// Initialize Bull-Board with BullMQ
createBullBoard({
  queues: [new BullMQAdapter(importQueue), new BullMQAdapter(exportQueue)], // ✅ Fix: Use BullMQAdapter
  serverAdapter,
});

const queues = new Queues();

export default { queues, serverAdapter, importQueue, exportQueue };
