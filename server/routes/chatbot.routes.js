import express from "express";

import {
  chatWithAI
} from "../controllers/chatbot.controller.js";


import {
  optionalAuth
} from "../middleware/optionalAuth.middleware.js";


const router = express.Router();



// ===============================
// AI Chat Route
// ===============================
// Guest:
// No Token → Public Data Only
//
// Customer:
// JWT → Public + Own Customer Data
//
// Owner:
// JWT → Public + Own Owner Data


router.post(
  "/message",
  optionalAuth,
  chatWithAI
);



export default router;