import Property from "../models/Property.js";
import { propertySchema } from "../validators/property.validator.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import { deleteFromCloudinary } from "../utils/cloudinaryDelete.js";

// ================= Add Property =================

export const addProperty = async (req, res) => {
  try {
    const validatedData = propertySchema.parse(req.body);

    // Check Images
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least 2 property images.",
      });
    }

    // Upload Images to Cloudinary (Parallel Upload)
    const uploadedImages = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file, "BaseraMitra/properties")
      )
    );

    // Create Property
    const property = await Property.create({
      owner: req.user._id,
      ...validatedData,
      images: uploadedImages,
      status: "available",
    });

    return res.status(201).json({
      success: true,
      message: "Property added successfully.",
      property,
    });

  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: error.issues[0].message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get All Properties =================

export const getAllProperties = async (req, res) => {
  try {
    const { search, city, listingType, propertyType } = req.query;

    const filter = {
      status: "available",
    };

    if (listingType) {
      filter.listingType = listingType;
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    if (city) {
      filter.city = {
        $regex: city,
        $options: "i",
      };
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          address: {
            $regex: search,
            $options: "i",
          },
        },
        {
          city: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const properties = await Property.find(filter)
      .populate("owner", "fullName phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get Single Property =================

export const getSingleProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "fullName phone email"
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    return res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get My Properties =================

export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= Update Property =================

export const updateProperty = async (req, res) => {
  try {

    const property = await Property.findById(req.params.id);


    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }


    // Owner Check
    if (
      property.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }



    let images = property.images;



    // If New Images Uploaded
    if (req.files && req.files.length > 0) {


      // Delete Old Images
      if (property.images.length > 0) {

        await Promise.all(
          property.images.map((image) =>
            deleteFromCloudinary(image.publicId)
          )
        );

      }



      // Upload New Images

      images = await Promise.all(
        req.files.map((file) =>
          uploadToCloudinary(
            file,
            "BaseraMitra/properties"
          )
        )
      );

    }



    const updatedProperty =
      await Property.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          images,
        },
        {
          new: true,
          runValidators: true,
        }
      );



    return res.status(200).json({
      success: true,
      message: "Property updated successfully.",
      property: updatedProperty,
    });



  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= Delete Property =================

export const deleteProperty = async (req, res) => {
  try {

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }


    // Check Owner
    if (
      property.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }


    // Delete Images From Cloudinary
    if (property.images && property.images.length > 0) {

      await Promise.all(
        property.images.map((image) =>
          deleteFromCloudinary(image.publicId)
        )
      );

    }


    // Delete Property From MongoDB
    await property.deleteOne();


    return res.status(200).json({
      success: true,
      message: "Property and images deleted successfully.",
    });


  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= Property Suggestions =================

export const getSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(200).json({
        success: true,
        suggestions: [],
      });
    }

    const properties = await Property.find({
      status: "available",
      $or: [
        {
          title: {
            $regex: q,
            $options: "i",
          },
        },
        {
          city: {
            $regex: q,
            $options: "i",
          },
        },
        {
          address: {
            $regex: q,
            $options: "i",
          },
        },
      ],
    }).select("title city address");

    const suggestions = [
      ...new Set(
        properties.flatMap((item) => [
          item.title,
          item.city,
          item.address,
        ])
      ),
    ];

    return res.status(200).json({
      success: true,
      suggestions,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};