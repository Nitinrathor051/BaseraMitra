import User from "../models/user.js";


// ======================================================
// GUEST CONTEXT
// ======================================================

export const getGuestContext = async () => {

  return {

    role: "guest",

    authenticated: false,

    name: null,

    email: null,

  };

};


// ======================================================
// CUSTOMER CONTEXT
// ======================================================

export const getCustomerContext = async (
  userId
) => {

  const user =
    await User.findById(userId)
      .select("fullName email");


  return {

    role: "customer",

    authenticated: true,

    name:
      user?.fullName || null,

    email:
      user?.email || null,

    access:
      "public + own customer features",

  };

};


// ======================================================
// OWNER CONTEXT
// ======================================================

export const getOwnerContext = async (
  userId
) => {

  const user =
    await User.findById(userId)
      .select("fullName email");


  return {

    role: "owner",

    authenticated: true,

    name:
      user?.fullName || null,

    email:
      user?.email || null,

    access:
      "public + own owner features",

  };

};