import express from "express";
import env from "./config.js";
import mongoose from "mongoose";
import errorHandler from "./src/middleware/errorHandler.js";
import router from "./indexRoute.js";

mongoose
  .connect(env.DB_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());

app.use("/", router);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
