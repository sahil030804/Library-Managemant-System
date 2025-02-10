import express from "express";
import env from "./src/config/index.js";
import mongoose from "mongoose";
import errorHandler from "./src/middleware/errorHandler.js";
import router from "./indexRoute.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import { RedisStore } from "connect-redis";
import redis from "./lib/redis.js";
import cors from "cors";
import fineCalculationJob from "./src/jobs/fineCalculation.js";
import dueDateReminder from "./src/jobs/dueDateReminder.js";
import queueHelper from "./src/utils/queueHelper.js";
import worker from "./lib/worker.js";

mongoose
  .connect(env.db.DB_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

//Bull mq dashboard
app.use("/admin/queues", queueHelper.serverAdapter.getRouter());

//Run worker for complete job
console.log(
  `Import worker is running correctly`,
  worker.importWorker.isRunning()
);
console.log(
  `Export worker is running correctly`,
  worker.exportWoker.isRunning()
);

app.use(
  session({
    secret: env.server.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
    store: new RedisStore({ client: await redis.createClient() }),
  })
);

app.use(cookieParser());

fineCalculationJob.start(); //cron job for fine calculation daily at 12:00 am midnight
dueDateReminder.start(); // cron job for send mail of due date reminder before duedate

app.use("/api", router);
app.use(errorHandler);

app.listen(env.server.PORT, () => {
  console.log(`Server is running on port ${env.server.PORT}`);
});
