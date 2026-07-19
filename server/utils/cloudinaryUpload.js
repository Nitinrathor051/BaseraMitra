import sharp from "sharp";
import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (
  file,
  folder = "BaseraMitra"
) => {
  try {
    // Compress Image
    const buffer = await sharp(file.buffer)
      .resize({
        width: 1600,
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 80,
      })
      .toBuffer();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });

  } catch (error) {
    throw error;
  }
};