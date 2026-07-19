import express from "express";

import {
  addFavorite,
  removeFavorite,
  getMyFavorites,
} from "../controllers/favorite.controller.js";

import { protect } from "../middleware/auth.middleware.js";


const router = express.Router();


// Add Favorite
router.post(
  "/:propertyId",
  protect,
  addFavorite
);


// Remove Favorite
router.delete(
  "/:propertyId",
  protect,
  removeFavorite
);


// My Favorites
router.get(
  "/",
  protect,
  getMyFavorites
);


export default router;