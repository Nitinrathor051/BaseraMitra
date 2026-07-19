import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


// Same user same property duplicate nahi kar sakta
favoriteSchema.index(
  {
    user: 1,
    property: 1,
  },
  {
    unique: true,
  }
);

const Favorite =
  mongoose.models.Favorite ||
  mongoose.model(
    "Favorite",
    favoriteSchema
  );


export default Favorite;