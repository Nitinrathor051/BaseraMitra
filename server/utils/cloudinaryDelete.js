import cloudinary from "../config/cloudinary.js";

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);

  } catch (error) {
    throw error;
  }
};