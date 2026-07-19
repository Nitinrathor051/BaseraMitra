// ===============================
// AI Action Types
// ===============================

export const AI_ACTIONS = {

  // Navigation
  NAVIGATE: "NAVIGATE",


  // Property Actions
  PROPERTY_DETAIL: "PROPERTY_DETAIL",


  // Customer Actions
  SEND_ENQUIRY: "SEND_ENQUIRY",

  ADD_FAVORITE: "ADD_FAVORITE",

  REMOVE_FAVORITE: "REMOVE_FAVORITE",

  VIEW_FAVORITES: "VIEW_FAVORITES",


  // Dashboard
  CUSTOMER_DASHBOARD: "CUSTOMER_DASHBOARD",

  OWNER_DASHBOARD: "OWNER_DASHBOARD",

};




// ===============================
// Create Standard AI Response
// ===============================

export const createAIResponse = (
  message,
  actions = []
) => {


  return {

    message,

    actions,

  };


};