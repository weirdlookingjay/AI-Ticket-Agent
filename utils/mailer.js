import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_USER,
      port: process.env.MAILTRAP_SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: "Inngest Team",
      to,
      subject,
      text,
    });

    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export default sendMail;
