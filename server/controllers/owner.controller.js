import Owner from "../models/Owner.js";
import User from "../models/user.js";

import { ownerSchema } from "../validators/owner.validator.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const becomeOwner = async (req, res) => {
  console.log("\n==============================");
  console.log("🚀 Become Owner API Hit");
  console.log("==============================");

  try {
    // Logged-in User
    const userId = req.user?._id;

    console.log("✅ User ID:", userId);

    // Request Body
    console.log("📦 Body:", req.body);

    // Uploaded File
    console.log("📸 File:", req.file);

    // Check if already owner
    const existingOwner = await Owner.findOne({
      user: userId,
    });

    if (existingOwner) {
      console.log("⚠️ Owner already exists");

      return res.status(400).json({
        success: false,
        message: "You are already registered as an owner.",
      });
    }

    console.log("✅ Owner does not exist");
// Upload Profile Image
let profileImage = "";
let uploadedImage = null;

if (!req.file) {
  console.log("❌ No profile image received");
} else {
  console.log("☁️ Uploading image to Cloudinary...");

  uploadedImage = await uploadToCloudinary(
    req.file,
    "BaseraMitra/users/profiles"
  );

  console.log("✅ Cloudinary Response:", uploadedImage);

  profileImage = uploadedImage.url;

  console.log("📝 Profile Image URL:", profileImage);
}

console.log("Cloudinary Upload Response:", uploadedImage);
console.log("Profile Image URL:", profileImage);

    // Validate Request
    const validatedData = ownerSchema.parse({
      ...req.body,
      profileImage,
    });

    console.log("✅ Validation Passed");
    console.log(validatedData);

    // Create Owner Profile
    const owner = await Owner.create({
      user: userId,
      ...validatedData,
    });

    console.log("✅ Owner Profile Created");
    console.log(owner);

    // Update User Role
    await User.findByIdAndUpdate(userId, {
      role: "owner",
      ownerStatus: "approved",
      profileImage,
    });

    console.log("✅ User Role Updated");

    return res.status(201).json({
      success: true,
      message: "Congratulations! You are now an Owner.",
      owner,
    });

  } catch (error) {
    console.log("\n==============================");
    console.log("❌ Become Owner Error");
    console.log("==============================");

    console.error(error);
    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("Stack:", error.stack);

    if (error.name === "ZodError") {
      console.log("❌ Validation Error:", error.issues);

      return res.status(400).json({
        success: false,
        message: error.issues[0].message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};