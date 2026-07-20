import express from "express";

import {
  register,
  login,
  getMe,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();



// ================= AUTH ROUTES =================

// Register
router.post(
  "/register",
  register
);


// Login
router.post(
  "/login",
  login
);



// ================= PROTECTED ROUTES =================

// Current Logged In User
router.get(
  "/me",
  protect,
  getMe
);

export default router;