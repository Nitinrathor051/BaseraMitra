import Groq from "groq-sdk";



const groq = new Groq({

  apiKey: process.env.GROQ_API_KEY,

});





// ===============================
// Generate AI Response
// ===============================


export const generateAIResponse = async (

  userMessage,

  systemPrompt

) => {


  try {



    const completion = await groq.chat.completions.create({

      model:"llama-3.3-70b-versatile",


      messages:[


        {
          role:"system",

          content:systemPrompt

        },


        {
          role:"user",

          content:userMessage

        }


      ],



      temperature:0.3,


      response_format:{

        type:"json_object"

      },


      max_tokens:300,


    });





    const aiContent =

    completion
    .choices[0]
    .message
    .content;





    const parsedResponse = JSON.parse(

      aiContent

    );





    return {


      message:

      parsedResponse.message || 
      "Sorry, I could not understand.",



      actions:

      parsedResponse.actions || []



    };






  }

  catch(error){



    console.log(

      "Groq Service Error:",

      error.message

    );



    return {


      message:

      "AI service is temporarily unavailable.",



      actions:[]


    };



  }


};