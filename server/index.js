import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";


import ownerRoutes from "./routes/owner.routes.js";
import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";



const app = express();


// ================= Middleware =================

app.use(cors());

app.use(express.json());




// ================= Routes =================


app.use(
  "/api/v1/auth",
  authRoutes
);


app.use(
  "/api/v1/owner",
  ownerRoutes
);


app.use(
  "/api/v1/properties",
  propertyRoutes
);


app.use(
  "/api/v1/favorites",
  favoriteRoutes
);


app.use(
  "/api/v1/inquiries",
  inquiryRoutes
);


app.use(
  "/api/v1/chatbot",
  chatbotRoutes
);





// ================= Error Handler =================

app.use((error, req, res, next) => {


  if(error.name === "MulterError"){


    const message =
    error.code === "LIMIT_FILE_SIZE"

    ? "Image size must be less than 5 MB."

    : error.message;



    return res.status(400).json({

      success:false,

      message

    });


  }




  if(error){


    return res.status(400).json({

      success:false,

      message:
      error.message || "Invalid request."

    });


  }


  next();


});






// ================= Test Routes =================


app.get("/",(req,res)=>{


  res.send(
    "🏠 BaseraMitra API Running..."
  );


});





app.get(
"/api/health",
(req,res)=>{


  res.status(200).json({

    success:true,

    message:
    "Server Running Successfully"

  });


});






// ================= MongoDB =================


mongoose
.connect(process.env.MONGO_URI)

.then(()=>{


  console.log(
    "✅ MongoDB Connected"
  );



  const PORT =
  process.env.PORT || 5000;



  app.listen(
    PORT,
    ()=>{

      console.log(
        `🚀 Server Running on Port ${PORT}`
      );

    }
  );


})


.catch((err)=>{


 console.log(
  "❌ MongoDB Error:",
  err.message
 );


});