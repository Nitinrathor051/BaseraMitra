import express from "express";

import {
  register,
  verifyEmail,
  login,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  getMe,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";


const router = express.Router();



// ================= Auth Routes =================


// Register
router.post(
  "/register",
  register
);



// Verify Email OTP
router.post(
  "/verify-email",
  verifyEmail
);



// Login
router.post(
  "/login",
  login
);



// ================= Forgot Password Flow =================


// Send Reset OTP
router.post(
  "/forgot-password",
  forgotPassword
);



// Verify Reset OTP
router.post(
  "/verify-reset-otp",
  verifyResetOTP
);



// Reset Password
router.post(
  "/reset-password",
  resetPassword
);




// Protected Route
router.get(
  "/me",
  protect,
  getMe
);



export default router;