import nodemailer from "nodemailer";
import env from "../config/index.js";

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: env.mail.SENDGRID_API_KEY,
  },
});

const sendMail = async (to, subject, text = "", html = "") => {
  const mailOptions = {
    from: env.mail.MAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  try {
    const mail = await transporter.sendMail(mailOptions);
    console.log("Email sent:", mail.accepted);
    return mail;
  } catch (err) {
    return new Error(err.message);
  }
};

export default sendMail;
