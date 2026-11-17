/**
 * Cloudinary Configuration
 * Handles image upload and storage configuration
 */

import { v2 as cloudinary } from 'cloudinary';

/**
 * Initialize Cloudinary with API credentials
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @async
 * @param {string} filePath - Local file path of the image
 * @param {string} folder - Cloudinary folder to store the image
 * @returns {Promise<Object>} - Cloudinary upload response with URL
 */
export const uploadImage = async (filePath, folder = 'abuhub') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @async
 * @param {string} publicId - Cloudinary public ID of the image
 * @returns {Promise<Object>} - Cloudinary delete response
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

export default { uploadImage, deleteImage };
