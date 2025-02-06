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

importQueue.on("waiting", ({ id }) => {
  console.log(`Job ${id} is waiting in the queue`);
});

importQueue.on("failed", ({ id, failedReason }) => {
  console.error(`Job ${id} failed due to: ${failedReason}`);
});

importQueue.on("completed", ({ id }) => {
  console.log(`Job ${id} completed`);
});

importQueue.on("paused", ({ id }) => {
  console.log(`Job ${id} paused`);
});
class Queues {
  async addImportJob(filePath) {
    const job = await importQueue.add(
      "importBooksJob",
      { filePath },
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
  queues: [new BullMQAdapter(importQueue)], // ✅ Fix: Use BullMQAdapter
  serverAdapter,
});

const queues = new Queues();

export default { queues, serverAdapter, importQueue };
