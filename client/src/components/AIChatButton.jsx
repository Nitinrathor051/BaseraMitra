import { Bot } from "lucide-react";

import "../styles/ai-chat.css";


const AIChatButton = ({ onClick }) => {


  return (


    <button

      onClick={onClick}

      className="ai-chat-button"

      aria-label="Open BaseraMitra AI Assistant"

    >


      <Bot size={28} />


    </button>


  );


};


export default AIChatButton;