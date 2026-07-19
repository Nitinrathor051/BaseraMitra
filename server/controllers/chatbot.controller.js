import {
  generateAIResponse
} from "../services/groq.service.js";


import {
  getGuestContext,
  getCustomerContext,
  getOwnerContext
} from "../services/chatbotContext.service.js";


import {
  guestPrompt,
  customerPrompt,
  ownerPrompt
} from "../prompts/chatbotPrompt.js";





// ===============================
// Chat With BaseraMitra AI
// ===============================

export const chatWithAI = async (req, res) => {


  try {


    const {
      message
    } = req.body;




    if(!message){


      return res.status(400).json({

        success:false,

        message:"Message is required"

      });


    }






    let prompt;

    let context;






    // ===============================
    // Guest User
    // ===============================


    if(!req.user){


      prompt = guestPrompt;


      context =
      await getGuestContext();


    }





    // ===============================
    // Customer User
    // ===============================


    else if(
      req.user.role === "customer"
    ){


      prompt = customerPrompt;


      context =
      await getCustomerContext(
        req.user._id
      );


    }







    // ===============================
    // Owner User
    // ===============================


    else if(
      req.user.role === "owner"
    ){


      prompt = ownerPrompt;


      context =
      await getOwnerContext(
        req.user._id
      );


    }







    else{


      prompt = guestPrompt;


      context =
      await getGuestContext();


    }









    const finalPrompt = `


${prompt}



USER QUESTION:

${message}



AVAILABLE CONTEXT:

${JSON.stringify(
  context,
  null,
  2
)}



FINAL RULES:

- Return only valid JSON.
- Follow given response format.
- Keep answer 1-2 sentences only.
- No greetings.
- No unnecessary explanation.
- Reply in user's language.
- Never reveal password, OTP, token.
- Never reveal private user data.
- Never create fake information.



`;







    const aiResponse =

    await generateAIResponse(

      message,

      finalPrompt

    );







    return res.status(200).json({


      success:true,


      response:aiResponse



    });







  }

  catch(error){



    console.log(

      "Chatbot Controller Error:",

      error

    );




    return res.status(500).json({


      success:false,


      message:error.message || "AI service failed"



    });



  }


};