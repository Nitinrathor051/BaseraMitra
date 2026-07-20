import axios from "axios";

export const sendEmail = async (email, subject, message) => {
  try {
    const response = await axios.post(
      "https://brevo.com",
      {
        sender: {
          name: "Basera Mitra",
          email: process.env.EMAIL_FROM, // Dhyaan dein: Yeh Brevo Dashboard me verified hona chahiye!
        },
        to: [
          {
            email: email, // Brevo me 'to' hamesha array of object hota hai
          },
        ],
        subject: subject,
        textContent: message, // Plain text ke liye textContent use karein
      },
      {
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY, // Render par BREVO_API_KEY naam se environment variable daal dena
        },
      }
    );

    console.log("✅ Email sent successfully via Brevo API");
    return response.data;
  } catch (error) {
    // Agar koi dikkat aayegi toh yeh log exact wajah print karega Render dashboard me
    console.error("❌ Email sending failed:", error.response ? error.response.data : error.message);
    throw error;
  }
};
