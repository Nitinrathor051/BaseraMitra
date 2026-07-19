import express from "express";

import {
  becomeOwner,
} from "../controllers/owner.controller.js";

import {
  protect,
} from "../middleware/auth.middleware.js";

import {
  uploadProfileImage,
} from "../middleware/upload.middleware.js";



const router = express.Router();



// Become Owner Account
router.post(
  "/become-owner",
  protect,
  uploadProfileImage,
  becomeOwner
);



export default router;