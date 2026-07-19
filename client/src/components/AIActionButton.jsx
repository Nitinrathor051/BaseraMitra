import { useNavigate } from "react-router-dom";
import { Heart, ExternalLink, Send } from "lucide-react";

import "../styles/ai-chat.css";


const AIActionButton = ({ action }) => {


  const navigate = useNavigate();



  const handleAction = () => {



    switch(action.type){



      // ==========================
      // Page Navigation
      // ==========================

      case "NAVIGATE":

        navigate(action.path);

        break;




      // ==========================
      // Property Detail
      // ==========================

      case "PROPERTY_DETAIL":

        navigate(
          `/property/${action.propertyId}`
        );

        break;




      // ==========================
      // Future Actions
      // ==========================

      case "SEND_ENQUIRY":

        navigate(
          `/property/${action.propertyId}`
        );

        break;




      case "ADD_FAVORITE":

        // Next step me API connect karenge

        console.log(
          "Add favorite:",
          action.propertyId
        );

        break;




      default:

        console.log(
          "Unknown AI Action:",
          action
        );

    }


  };






  const getIcon = () => {


    switch(action.type){


      case "PROPERTY_DETAIL":
        return <ExternalLink size={15}/>;


      case "ADD_FAVORITE":
        return <Heart size={15}/>;


      case "SEND_ENQUIRY":
        return <Send size={15}/>;


      default:
        return null;


    }


  };






  return (


    <button

      className="ai-action-btn"

      onClick={handleAction}

    >

      {getIcon()}

      {action.label}


    </button>


  );


};



export default AIActionButton;