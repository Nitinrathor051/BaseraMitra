import axios from "axios";

const sendEmail = async (
  email,
  subject,
  message
) => {

  try {

    const response = await axios.post(

      "https://api.brevo.com/v3/smtp/email",

      {
        sender: {
          name: "BaseraMitra",
          email: process.env.EMAIL_FROM,
        },

        to: [
          {
            email,
          },
        ],

        subject,

        textContent: message,
      },

      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }

    );

    console.log("✅ Brevo Email Sent:", response.status);

    return true;

  } catch (error) {

    console.log("❌ STATUS:", error.response?.status);
    console.log("❌ DATA:", error.response?.data);
    console.log("❌ MESSAGE:", error.message);

    throw error;

  }

};

export default sendEmail;