import jwt from "jsonwebtoken";
import User from "../models/user.js";


export const optionalAuth = async (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;


    // Guest user
    if (!authHeader) {

      req.user = null;

      return next();

    }


    const token = authHeader.split(" ")[1];


    if (!token) {

      req.user = null;

      return next();

    }



    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );



    const user = await User.findById(
      decoded.userId
    );



    req.user = user || null;


    next();


  } catch (error) {


    // Invalid token ko bhi guest treat karenge

    req.user = null;

    next();


  }

};