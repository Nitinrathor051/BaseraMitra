import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({

  service: "gmail",

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

      from: `BaseraMitra <${process.env.EMAIL_USER}>`,

      to: email,

      subject,

      text: message,

    });


    console.log("✅ Email sent successfully");


  } catch (error) {

    console.log(
      "❌ Email sending failed:",
      error.message
    );

    throw error;
  }

};