import nodemailer from "nodemailer";

import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
} as SMTPTransport.Options);

const sendMail = async (to: string, subject: string, text: string, htmlBody: string | undefined = undefined) => {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.SMTP_USERNAME} <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: htmlBody,
    });
    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendMail;