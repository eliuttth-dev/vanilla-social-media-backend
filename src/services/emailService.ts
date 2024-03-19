import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export default async function sendEmail(recipient: string, subject: string, text: string): Promise<void> {
  try {
    // Create transpoter using gmail smtp server
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_OWNER_MAIL || "user_mail",
        pass: process.env.NODEMAILER_OWNER_APP_PASS || "user_app_password",
      },
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_OWNER_MAIL || "owner_mail",
      to: recipient,
      subject: subject,
      html: `
        <h1>New Confimation Mail</h1>
        <p>${text}</p>
      `,
    });

    //eslint-disable-next-line no-console
    console.log("Message sent:", recipient, info.messageId);
  } catch (error) {
    //eslint-disable-next-line no-console
    console.error("Error sending email", error);
  }
}
