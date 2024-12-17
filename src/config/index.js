import dotenv from "dotenv-safe";

dotenv.config({
  path: "./.env",
  sample: "./.env.example",
  allowEmptyValues: false,
});

const env = {
  db: {
    DB_URL: process.env.DB_URL,
  },
  server: {
    PORT: process.env.PORT,
    SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
  },
  jwt: {
    ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  },
};

export default env;
