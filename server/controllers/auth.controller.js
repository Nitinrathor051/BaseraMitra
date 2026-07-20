import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import OTP from "../models/OTP.js";

import { registerSchema } from "../validators/auth.validator.js";

import sendEmail from "../utils/sendEmail.js";



// ================= Register =================

export const register = async (req,res)=>{

  try{


    const validatedData =
    registerSchema.parse(req.body);



    const {
      fullName,
      email,
      phone,
      password
    } = validatedData;



    const existingUser =
    await User.findOne({ email });



    // Existing unverified user

    if(existingUser && !existingUser.isVerified){


      const hashedPassword =
      await bcrypt.hash(password,10);



      await User.findByIdAndUpdate(

        existingUser._id,

        {

          fullName,

          phone,

          password:hashedPassword,

          isVerified:false

        }

      );



      await OTP.deleteMany({

        email,

        purpose:"verify-email"

      });



      const otp = generateOTP();



      await OTP.create({

        email,

        otp,

        purpose:"verify-email",

        expiresAt:new Date(

          Date.now()+5*60*1000

        )

      });



      await sendEmail(

        email,

        "BaseraMitra Email Verification OTP",

        `Your OTP is ${otp}. Valid for 5 minutes.`

      );



      return res.status(200).json({

        success:true,

        message:
        "New OTP sent for verification."

      });


    }





    // Already registered

    if(existingUser){


      return res.status(400).json({

        success:false,

        message:
        "Email already registered"

      });


    }





    const hashedPassword =
    await bcrypt.hash(password,10);




    const user =
    await User.create({

      fullName,

      email,

      phone,

      password:hashedPassword,

      isVerified:false

    });





    const otp = generateOTP();



    await OTP.create({

      email,

      otp,

      purpose:"verify-email",

      expiresAt:new Date(

        Date.now()+5*60*1000

      )

    });





    await sendEmail(

      email,

      "BaseraMitra Email Verification OTP",

      `Your verification OTP is ${otp}. Valid for 5 minutes.`

    );





    return res.status(201).json({

      success:true,

      message:
      "Registration successful. Verify email.",

      data:{

        id:user._id,

        email:user.email

      }

    });



  }

  catch(error){


    if(error.name==="ZodError"){

      return res.status(400).json({

        success:false,

        message:error.issues[0].message

      });

    }



    return res.status(500).json({

      success:false,

      message:error.message

    });


  }

};






// ================= Verify Email =================


export const verifyEmail = async(req,res)=>{

  try{


    const {
      email,
      otp
    } = req.body;




    const otpData =
    await OTP.findOne({

      email,

      otp,

      purpose:"verify-email"

    });





    if(!otpData){

      return res.status(400).json({

        success:false,

        message:"Invalid OTP"

      });

    }





    if(otpData.expiresAt < new Date()){


      return res.status(400).json({

        success:false,

        message:"OTP expired"

      });

    }






    const user =
    await User.findOneAndUpdate(

      {email},

      {
        isVerified:true
      },

      {
        new:true
      }

    );





    if(!user){

      return res.status(404).json({

        success:false,

        message:"User not found"

      });

    }




    await OTP.deleteMany({

      email,

      purpose:"verify-email"

    });





    return res.status(200).json({

      success:true,

      message:
      "Email verified successfully"

    });



  }

  catch(error){

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};
// ================= Login =================

export const login = async(req,res)=>{

  try{


    const {
      login,
      password
    } = req.body;




    if(!login || !password){

      return res.status(400).json({

        success:false,

        message:
        "Login and Password are required"

      });

    }





    const user =
    await User.findOne({

      $or:[

        {
          email:login.toLowerCase()
        },

        {
          phone:login
        }

      ]

    }).select("+password");






    if(!user){


      return res.status(404).json({

        success:false,

        message:"User not found"

      });


    }






    // Email verification check

    if(!user.isVerified){


      return res.status(403).json({

        success:false,

        message:
        "Please verify your email first"

      });


    }





    const isPasswordMatch =
    await bcrypt.compare(

      password,

      user.password

    );





    if(!isPasswordMatch){


      return res.status(401).json({

        success:false,

        message:
        "Invalid Password"

      });


    }







    const token =
    jwt.sign(

      {

        userId:user._id,

        role:user.role

      },

      process.env.JWT_SECRET,

      {

        expiresIn:"7d"

      }

    );






    return res.status(200).json({

      success:true,

      message:
      "Login Successful",

      token,

      user:{

        id:user._id,

        fullName:user.fullName,

        email:user.email,

        phone:user.phone,

        role:user.role,

        isVerified:user.isVerified

      }


    });




  }

  catch(error){


    return res.status(500).json({

      success:false,

      message:error.message

    });


  }


};








// ================= Forgot Password =================


export const forgotPassword = async(req,res)=>{


  try{


    const {
      email
    } = req.body;





    if(!email){


      return res.status(400).json({

        success:false,

        message:
        "Email is required"

      });


    }





    const user =
    await User.findOne({

      email:email.toLowerCase()

    });





    if(!user){


      return res.status(404).json({

        success:false,

        message:
        "User not found"

      });


    }





    // Remove old OTP

    await OTP.deleteMany({

      email,

      purpose:"forgot-password"

    });







    const otp = generateOTP();






    await OTP.create({

      email,

      otp,

      purpose:"forgot-password",

      expiresAt:new Date(

        Date.now()+5*60*1000

      )

    });






    await sendEmail(

      email,

      "BaseraMitra Password Reset OTP",

      `Your password reset OTP is ${otp}. Valid for 5 minutes.`

    );







    return res.status(200).json({

      success:true,

      message:
      "Password reset OTP sent"

    });






  }

  catch(error){


    return res.status(500).json({

      success:false,

      message:error.message

    });


  }


};









// ================= Verify Reset OTP =================


export const verifyResetOTP = async(req,res)=>{


  try{


    const {

      email,

      otp

    } = req.body;







    const otpData =
    await OTP.findOne({

      email,

      otp,

      purpose:"forgot-password"

    });






    if(!otpData){


      return res.status(400).json({

        success:false,

        message:
        "Invalid OTP"

      });


    }






    if(otpData.expiresAt < new Date()){


      return res.status(400).json({

        success:false,

        message:
        "OTP expired"

      });


    }







    return res.status(200).json({

      success:true,

      message:
      "OTP verified successfully"

    });




  }

  catch(error){


    return res.status(500).json({

      success:false,

      message:error.message

    });


  }


};
// ================= Reset Password =================

export const resetPassword = async(req,res)=>{

  try{


    const {

      email,

      otp,

      newPassword

    } = req.body;






    if(!email || !otp || !newPassword){


      return res.status(400).json({

        success:false,

        message:
        "Email, OTP and New Password are required"

      });


    }







    // Verify OTP

    const otpData =
    await OTP.findOne({

      email,

      otp,

      purpose:"forgot-password"

    });






    if(!otpData){


      return res.status(400).json({

        success:false,

        message:
        "Invalid OTP"

      });


    }







    if(otpData.expiresAt < new Date()){


      return res.status(400).json({

        success:false,

        message:
        "OTP expired"

      });


    }








    // Hash New Password

    const hashedPassword =
    await bcrypt.hash(

      newPassword,

      10

    );







    // Update User Password

    const user =
    await User.findOneAndUpdate(

      {

        email

      },

      {

        password:hashedPassword

      },

      {

        new:true

      }

    );






    if(!user){


      return res.status(404).json({

        success:false,

        message:
        "User not found"

      });


    }







    // Delete OTP

    await OTP.deleteMany({

      email,

      purpose:"forgot-password"

    });








    return res.status(200).json({

      success:true,

      message:
      "Password reset successfully. Please login."

    });






  }

  catch(error){


    return res.status(500).json({

      success:false,

      message:error.message

    });


  }


};








// ================= Get Current User =================


export const getMe = async(req,res)=>{


  try{


    return res.status(200).json({

      success:true,

      user:req.user

    });




  }

  catch(error){


    return res.status(500).json({

      success:false,

      message:error.message

    });


  }


};
// ================= Generate OTP =================

const generateOTP = () => {

  return Math.floor(
    100000 +
    Math.random() * 900000
  ).toString();

};