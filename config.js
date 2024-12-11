import dotenv from "dotenv-safe";

dotenv.config({
  path: "./.env",
  sample: "./.env.example",
  allowEmptyValues: false,
});

const env = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
};

export default env;
