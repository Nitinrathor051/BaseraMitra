
import {
  useEffect,
  useState
} from "react";

import {
  X,
  Send,
  Bot
} from "lucide-react";

import "../styles/ai-chat.css";

import {
  sendChatMessage
} from "../services/chatbot.service";

import AIActionButton from "./AIActionButton";


// ======================================================
// LOCAL STORAGE KEY
// ======================================================

const CHAT_STORAGE_KEY =
  "baseraMitra_ai_chat_history";


// ======================================================
// DEFAULT CHAT
// ======================================================

const defaultMessages = [
  {
    role: "ai",

    text:
      "Hi! I'm your BaseraMitra AI Assistant, here to help you find the right property.",

    actions: []
  }
];


// ======================================================
// AI CHAT BOX
// ======================================================

const AIChatBox = ({ close }) => {


  // ====================================================
  // LOAD OLD CHAT FROM LOCAL STORAGE
  // ====================================================

  const [messages, setMessages] =
    useState(() => {

      try {

        const savedChat =
          localStorage.getItem(
            CHAT_STORAGE_KEY
          );


        if (!savedChat) {
          return defaultMessages;
        }


        const parsedChat =
          JSON.parse(savedChat);


        if (
          Array.isArray(parsedChat) &&
          parsedChat.length > 0
        ) {
          return parsedChat;
        }


        return defaultMessages;

      } catch (error) {

        console.error(
          "Chat history load error:",
          error
        );

        return defaultMessages;

      }

    });


  const [message, setMessage] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  // ====================================================
  // SAVE CHAT HISTORY
  // ====================================================

  useEffect(() => {

    try {

      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(messages)
      );

    } catch (error) {

      console.error(
        "Chat history save error:",
        error
      );

    }

  }, [messages]);


  // ====================================================
  // SEND MESSAGE
  // ====================================================

  const sendMessage = async () => {

    if (
      !message.trim() ||
      loading
    ) {
      return;
    }


    const userMessage =
      message.trim();


    // -----------------------------------------------
    // Add user message immediately
    // -----------------------------------------------

    setMessages((prev) => [

      ...prev,

      {
        role: "user",
        text: userMessage,
        actions: []
      }

    ]);


    setMessage("");
    setLoading(true);


    try {

      const result =
        await sendChatMessage(
          userMessage
        );


      // ---------------------------------------------
      // SUCCESS
      // ---------------------------------------------

      if (result?.success) {

        setMessages((prev) => [

          ...prev,

          {
            role: "ai",

            text:
              result.response?.message ||
              "How can I help you with a property?",

            actions:
              result.response?.actions || []
          }

        ]);

      }


      // ---------------------------------------------
      // BACKEND ERROR
      // ---------------------------------------------

      else {

        setMessages((prev) => [

          ...prev,

          {
            role: "ai",

            text:
              result.response?.message ||
              "Sorry, I'm having trouble right now.",

            actions: []
          }

        ]);

      }

    } catch (error) {

      console.error(
        "AI Chat Error:",
        error
      );


      setMessages((prev) => [

        ...prev,

        {
          role: "ai",

          text:
            "Sorry, I'm having trouble right now.",

          actions: []
        }

      ]);

    } finally {

      setLoading(false);

    }

  };


  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="ai-chat-box">


      {/* ==========================
          HEADER
      ========================== */}

      <div className="ai-chat-header">

        <div className="ai-chat-title">

          <Bot size={20} />

          <span>
            BaseraMitra AI
          </span>

        </div>


        <button
          className="ai-close-btn"
          onClick={close}
          aria-label="Close AI chat"
        >

          <X size={20} />

        </button>

      </div>


      {/* ==========================
          MESSAGES
      ========================== */}

      <div className="ai-chat-messages">

        {messages.map(
          (msg, index) => (

            <div
              key={index}

              className={
                msg.role === "user"
                  ? "ai-message ai-user"
                  : "ai-message ai-bot"
              }
            >

              <div>
                {msg.text}
              </div>


              {/* ==========================
                  AI ACTIONS
              ========================== */}

              {msg.role === "ai" &&
                msg.actions?.length > 0 && (

                  <div className="ai-actions">

                    {msg.actions.map(
                      (action, i) => (

                        <AIActionButton
                          key={i}
                          action={action}
                        />

                      )
                    )}

                  </div>

                )}

            </div>

          )
        )}


        {/* ==========================
            TYPING INDICATOR
        ========================== */}

        {loading && (

          <div className="ai-typing">
            AI is typing...
          </div>

        )}

      </div>


      {/* ==========================
          INPUT
      ========================== */}

      <div className="ai-chat-input">

        <input

          type="text"

          placeholder="Ask about properties..."

          value={message}

          onChange={(e) =>
            setMessage(e.target.value)
          }

          onKeyDown={(e) => {

            if (e.key === "Enter") {
              sendMessage();
            }

          }}

          disabled={loading}

          aria-label="Ask BaseraMitra AI"

        />


        <button

          className="ai-send-btn"

          onClick={sendMessage}

          disabled={
            loading ||
            !message.trim()
          }

          aria-label="Send message"

        >

          <Send size={18} />

        </button>

      </div>

    </div>

  );

};


export default AIChatBox;

