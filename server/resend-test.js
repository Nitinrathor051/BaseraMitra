import "dotenv/config";
import axios from "axios";


const testEmail = async () => {

  try {

    const response = await axios.post(

      "https://api.resend.com/emails",

      {
        from: "BaseraMitra <onboarding@resend.dev>",

        to: [
          "baseramitra@gmail.com"
        ],

        subject: "BaseraMitra Test Email",

        text: "Hello from BaseraMitra Resend Test",

      },

      {
        headers: {

          Authorization:
          `Bearer ${process.env.RESEND_API_KEY}`,

          "Content-Type":
          "application/json",

        },
      }

    );


    console.log(
      "✅ Email Sent:",
      response.data
    );


  } catch(error) {


    console.log(
      "❌ Error:",
      error.response?.data || error.message
    );


  }

};


testEmail();