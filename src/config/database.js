import dotenv from "dotenv-safe";

dotenv.config({
  path: "./.env",
  sample: "./.env.example",
  allowEmptyValues: false,
});

const db = {
  DB_URL: process.env.DB_URL,
};

export default db;
