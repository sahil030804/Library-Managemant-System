import dotenv from "dotenv-safe";

dotenv.config({
  path: "./.env",
  sample: "./.env.example",
  allowEmptyValues: false,
});

const env = {
  server: {
    PORT: process.env.PORT,
  },
  db: {
    DB_URL: process.env.DB_URL,
  },
  jwt: {
    ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  },
};

export default env;
