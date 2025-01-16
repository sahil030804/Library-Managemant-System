import nodemailer from "nodemailer";
import env from "../config/index.js";

const transporter = nodemailer.createTransport({
  host: env.mail.MAIL_HOST,
  port: env.mail.MAIL_PORT,
  secure: false,
  auth: {
    user: env.mail.SENDER_EMAIL_ID,
    pass: env.mail.SENDER_EMAIL_PASSWORD,
  },
});

const sendMail = async (to, subject, text = "", html = "") => {
  const mailOptions = {
    from: env.mail.SENDER_EMAIL_ID,
    to,
    subject,
    text,
    html,
  };
  try {
    const mail = await transporter.sendMail(mailOptions);
    console.log("Email sent:", mail.response);
    return mail;
  } catch (err) {
    return new Error(err.message);
  }
};

export default sendMail;
