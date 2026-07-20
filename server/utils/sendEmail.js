import axios from "axios";

const sendEmail = async (
  email,
  subject,
  message
) => {

  try {

    const response = await axios.post(

      "https://api.resend.com/emails",

      {
        from: `BaseraMitra <onboarding@resend.dev>`,

        to: [
          email
        ],

        subject,

        text: message,
      },

      {
        headers: {

          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,

          "Content-Type": "application/json",

        },

      }

    );


    console.log(
      "✅ Resend Email Sent:",
      response.data
    );


    return true;


  } catch (error) {


    console.log(
      "❌ STATUS:",
      error.response?.status
    );


    console.log(
      "❌ DATA:",
      error.response?.data
    );


    console.log(
      "❌ MESSAGE:",
      error.message
    );


    throw error;

  }

};


export default sendEmail;