import express from "express";

import {
  sendInquiry,
  getOwnerInquiries,
} from "../controllers/inquiry.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { isOwner } from "../middleware/owner.middleware.js";


const router = express.Router();


// Customer Send Inquiry
router.post(
  "/:propertyId",
  protect,
  sendInquiry
);


// Owner Get Inquiries
router.get(
  "/",
  protect,
  isOwner,
  getOwnerInquiries
);


export default router;
