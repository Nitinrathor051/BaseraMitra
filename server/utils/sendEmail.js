import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (
  email,
  subject,
  message
) => {
  try {
    await transporter.sendMail({
      from: `"BaseraMitra" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: message,
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};