import api from "./api";

// ===============================
// Send Message To AI
// ===============================

export const sendChatMessage = async (message) => {
  try {
    const { data } = await api.post("/api/v1/chatbot/message", {
      message,
    });

    return data;
  } catch (error) {
    return {
      success: false,
      response:
        error.response?.data?.message ||
        "AI service unavailable.",
    };
  }
};