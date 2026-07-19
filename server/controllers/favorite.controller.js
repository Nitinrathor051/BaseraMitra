import Favorite from "../models/Favorite.js";
import Property from "../models/Property.js";


// ================= Add Favorite =================

export const addFavorite = async (req, res) => {
  try {

    const { propertyId } = req.params;


    // Check Property Exists
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }


    // Check Already Favorite

    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      property: propertyId,
    });


    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Property already in favorites.",
      });
    }


    const favorite = await Favorite.create({
      user: req.user._id,
      property: propertyId,
    });


    return res.status(201).json({
      success: true,
      message: "Property added to favorites.",
      favorite,
    });


  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




// ================= Remove Favorite =================

export const removeFavorite = async (req, res) => {
  try {

    const { propertyId } = req.params;


    const favorite = await Favorite.findOne({
      user: req.user._id,
      property: propertyId,
    });


    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found.",
      });
    }


    await favorite.deleteOne();


    return res.status(200).json({
      success: true,
      message: "Removed from favorites.",
    });


  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};





// ================= Get My Favorites =================

export const getMyFavorites = async (req, res) => {
  try {


    const favorites = await Favorite.find({
      user: req.user._id,
    })
      .populate({
        path: "property",
        populate: {
          path: "owner",
          select: "fullName phone",
        },
      })
      .sort({
        createdAt: -1,
      });



    return res.status(200).json({
      success: true,
      count: favorites.length,
      favorites,
    });



  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};