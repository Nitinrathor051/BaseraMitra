import Property from "../models/property.js";
import User from "../models/user.js";
import Favorite from "../models/favorite.js";
import Inquiry from "../models/inquiry.js";




// ===============================
// Guest Context
// ===============================

export const getGuestContext = async () => {


  const properties = await Property.find({

    status:"available"

  })
  .select(
    "title city state propertyType listingType price area"
  )
  .limit(5);



  return {

    role:"guest",

    access:"public",

    properties

  };


};







// ===============================
// Customer Context
// ===============================

export const getCustomerContext = async(userId)=>{


  const user = await User.findById(userId)
  .select(
    "fullName email phone"
  );




  const favorites = await Favorite.find({

    user:userId

  })
  .populate({

    path:"property",

    select:
    "title city propertyType listingType price status"

  })
  .limit(5);






  const enquiries = await Inquiry.find({

    customer:userId

  })
  .populate({

    path:"property",

    select:
    "title city price"

  })
  .populate({

    path:"owner",

    select:
    "fullName"

  })
  .limit(5);







  const publicProperties = await Property.find({

    status:"available"

  })
  .select(

    "title city state propertyType listingType price"

  )
  .limit(5);







  return {


    role:"customer",


    access:
    "public data + own customer data",



    profile:{


      name:user?.fullName,

      email:user?.email

    },



    favorites,



    enquiries,



    publicProperties



  };


};









// ===============================
// Owner Context
// ===============================

export const getOwnerContext = async(userId)=>{


  const owner = await User.findById(userId)
  .select(

    "fullName email phone"

  );







  const myProperties = await Property.find({

    owner:userId

  })
  .select(

    "title city state propertyType listingType price status"

  );







  const myEnquiries = await Inquiry.find({

    owner:userId

  })
  .populate({

    path:"customer",

    select:
    "fullName email phone"

  })
  .populate({

    path:"property",

    select:
    "title city price"

  })
  .limit(10);








  const publicProperties = await Property.find({

    status:"available"

  })
  .select(

    "title city propertyType listingType price"

  )
  .limit(5);







  return {



    role:"owner",


    access:
    "public data + own properties + related customers",



    owner:{


      name:owner?.fullName,

      email:owner?.email


    },



    myProperties,



    receivedEnquiries:myEnquiries,



    publicProperties



  };


};