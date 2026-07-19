import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
    },

    listingType: {
      type: String,
      enum: ["rent", "buy"],
      required: true,
    },

    propertyType: {
      type: String,
      enum: [
        "house",
        "apartment",
        "room",
        "villa",
        "shop",
        "office",
        "pg",
        "plot",
      ],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    area: {
      type: Number,
      required: true,
      min: 1,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],

    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);
// ---------- Indexes (Fast Search) ----------
propertySchema.index({ city: 1 });
propertySchema.index({ listingType: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ createdAt: -1 });


// Prevent OverwriteModelError during hot reload

const Property =
  mongoose.models.Property ||
  mongoose.model(
    "Property",
    propertySchema
  );


export default Property;