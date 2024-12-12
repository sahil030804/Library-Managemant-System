import express from "express";
import env from "./config.js";
import mongoose from "mongoose";
import errorHandler from "./src/middleware/errorHandler.js";
import router from "./indexRoute.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";

mongoose
  .connect(env.db.DB_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());

const client = createClient({
  username: "default",
  password: "yhHO3kbMTR7U6ABXnHRPDSnbPRGZh6OP",
  socket: {
    host: "redis-16280.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 16280,
  },
});
client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () => console.log("Redis Server Connected"));

await client.connect();

app.use(
  session({
    secret: env.server.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
    store: new RedisStore({ client }),
  })
);

app.use(cookieParser());

app.use("/", router);
app.use(errorHandler);

app.listen(env.server.PORT, () => {
  console.log(`Server is running on port ${env.server.PORT}`);
});
