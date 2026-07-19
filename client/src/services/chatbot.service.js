import axios from "axios";


const API_URL =
"http://localhost:5000/api/v1/chatbot/message";



export const sendChatMessage = async(message)=>{


  try{


    const token =
    localStorage.getItem("token");



    const config = token
    ? {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    : {};




    const response =
    await axios.post(

      API_URL,

      {
        message
      },

      config

    );



    return response.data;


  }

  catch(error){


    return {

      success:false,

      message:
      error.response?.data?.message ||
      "AI service unavailable"

    };


  }


};