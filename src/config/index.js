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
  borrow: {
    FINE: process.env.FINE,
    DUE_TIME: process.env.DUE_TIME,
    EXTEND_TIME: process.env.EXTEND_TIME,
  },
  redis: {
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
  },
  mail: {
    MAIL_FROM: process.env.MAIL_FROM,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  },
};

export default env;
