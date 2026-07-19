import express from "express";
import {
  addProperty,
  getAllProperties,
  getSuggestions,
  getSingleProperty,
  getMyProperties,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { isOwner } from "../middleware/owner.middleware.js";
import { uploadPropertyImages } from "../middleware/upload.middleware.js";

const router = express.Router();

// ================= Public Routes =================

// Get All Properties
router.get("/", getAllProperties);

// Search Suggestions (Autocomplete)
router.get("/suggestions", getSuggestions);

// Get My Properties (Owner)
router.get("/my-properties", protect, isOwner, getMyProperties);

// Get Single Property
router.get("/:id", getSingleProperty);

// ================= Owner Routes =================

// Add Property
router.post(
  "/",
  protect,
  isOwner,
  uploadPropertyImages,
  addProperty
);

// Update Property
router.put(
  "/:id",
  protect,
  isOwner,
  uploadPropertyImages,
  updateProperty
);

// Delete Property
router.delete("/:id", protect, isOwner, deleteProperty);

export default router;