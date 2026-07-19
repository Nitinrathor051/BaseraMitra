import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    // Customer who sent inquiry
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Property Owner
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Related Property
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    // Customer Details
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

const Inquiry =
  mongoose.models.Inquiry ||
  mongoose.model(
    "Inquiry",
    inquirySchema
  );


export default Inquiry;