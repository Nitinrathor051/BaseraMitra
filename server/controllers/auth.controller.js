import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

import { registerSchema } from "../validators/auth.validator.js";



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
      await User.findOne({

        email:email.toLowerCase()

      });



    if(existingUser){

      return res.status(400).json({

        success:false,

        message:"Email already registered"

      });

    }




    const hashedPassword =
      await bcrypt.hash(password,10);




    const user =
      await User.create({

        fullName,

        email:email.toLowerCase(),

        phone,

        password:hashedPassword,

        role:"customer"

      });





    return res.status(201).json({

      success:true,

      message:"Registration successful",

      user:{

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






// ================= Login =================

export const login = async(req,res)=>{

try{


const {
  login,
  password
}=req.body;




if(!login || !password){

return res.status(400).json({

success:false,

message:"Login and Password are required"

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





const isPasswordMatch =
await bcrypt.compare(

password,

user.password

);





if(!isPasswordMatch){

return res.status(401).json({

success:false,

message:"Invalid Password"

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

message:"Login Successful",

token,


user:{

id:user._id,

fullName:user.fullName,

email:user.email,

phone:user.phone,

role:user.role

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