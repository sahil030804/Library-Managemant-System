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
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    SENDER_EMAIL_ID: process.env.SENDER_EMAIL_ID,
    SENDER_EMAIL_PASSWORD: process.env.SENDER_EMAIL_PASSWORD,
    MAIL_API_KEY: process.env.MAIL_API_KEY,
  },
  job: {
    FINE_CALCULATOR_SCHEDULE: process.env.FINE_CALCULATOR_SCHEDULE,
    DUE_DATE_REMINDER_SCHEDULE: process.env.DUE_DATE_REMINDER_SCHEDULE,
  },
};

export default env;
