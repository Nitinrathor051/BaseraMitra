
export const sendEmail = async (email, subject, message) => {
  try {
    const response = await fetch("https://brevo.com", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY, // Render dashboard me ye key zaroor check kar lena
      },
      body: JSON.stringify({
        sender: {
          name: "Basera Mitra",
          email: process.env.EMAIL_FROM, // Brevo me verified email hona zaroori hai
        },
        to: [
          {
            email: email, // Brevo ka format array ke andar object hi hota hai
          },
        ],
        subject: subject,
        textContent: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log("✅ Email sent successfully via Built-in Fetch API");
    return data;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};
