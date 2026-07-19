import {
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



const AIChatBox = ({ close }) => {


  const [message, setMessage] = useState("");



  const [messages, setMessages] = useState([

    {
      role:"ai",

      text:
      "Namaste! Main BaseraMitra AI Assistant hoon.",

      actions:[]

    }

  ]);



  const [loading, setLoading] = useState(false);






  const sendMessage = async () => {


    if(!message.trim()) return;



    const userMessage = message;



    setMessages((prev)=>[

      ...prev,

      {
        role:"user",
        text:userMessage,
        actions:[]
      }

    ]);



    setMessage("");

    setLoading(true);





    const result =
    await sendChatMessage(
      userMessage
    );







    if(result.success){



      setMessages((prev)=>[

        ...prev,

        {

          role:"ai",


          text:
          result.response.message,


          actions:
          result.response.actions || []


        }


      ]);



    }

    else{


      setMessages((prev)=>[

        ...prev,


        {

          role:"ai",

          text:
          result.response.message ||
          "AI service unavailable.",


          actions:[]

        }


      ]);



    }






    setLoading(false);



  };







  return (


    <div className="ai-chat-box">





      {/* Header */}

      <div className="ai-chat-header">


        <div className="ai-chat-title">


          <Bot size={20}/>


          <span>
            BaseraMitra AI
          </span>


        </div>




        <button

          className="ai-close-btn"

          onClick={close}

        >

          <X size={20}/>


        </button>



      </div>








      {/* Messages */}



      <div className="ai-chat-messages">


        {
          messages.map((msg,index)=>(



            <div
              key={index}
              className={
                msg.role==="user"
                ?
                "ai-message ai-user"
                :
                "ai-message ai-bot"
              }
            >



              <div>

                {msg.text}

              </div>






              {/* AI Actions */}

              {
                msg.role==="ai" &&
                msg.actions?.length > 0 &&


                (

                  <div className="ai-actions">


                    {
                      msg.actions.map(
                        (action,i)=>(

                          <AIActionButton

                            key={i}

                            action={action}

                          />

                        )

                      )

                    }


                  </div>


                )

              }




            </div>


          ))

        }







        {
          loading && (

            <div className="ai-typing">

              AI is typing...

            </div>

          )
        }





      </div>








      {/* Input */}


      <div className="ai-chat-input">


        <input


          type="text"


          placeholder="Ask about properties..."


          value={message}



          onChange={(e)=>
            setMessage(e.target.value)
          }



          onKeyDown={(e)=>{

            if(e.key==="Enter")
            sendMessage();

          }}



        />






        <button

          className="ai-send-btn"

          onClick={sendMessage}

        >

          <Send size={18}/>


        </button>



      </div>





    </div>


  );


};



export default AIChatBox;